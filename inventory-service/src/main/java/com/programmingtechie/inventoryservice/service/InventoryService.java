package com.programmingtechie.inventoryservice.service;

import com.programmingtechie.inventoryservice.dto.*;
import com.programmingtechie.inventoryservice.model.ImportReceipt;
import com.programmingtechie.inventoryservice.model.ImportReceiptItem;
import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.model.InventoryMovement;
import com.programmingtechie.inventoryservice.repository.ImportReceiptRepository;
import com.programmingtechie.inventoryservice.repository.InventoryMovementRepository;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private static final String DRAFT = "DRAFT";
    private static final String COMPLETED = "COMPLETED";
    private static final String IN = "IN";
    private static final String OUT = "OUT";
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    private final InventoryRepository inventoryRepository;
    private final ImportReceiptRepository importReceiptRepository;
    private final InventoryMovementRepository movementRepository;
    private final RestTemplate restTemplate;

    @Transactional(readOnly = true)
    @SneakyThrows
    public List<InventoryResponse> isInStock(List<String> skuCode) {
        log.info("Checking Inventory");
        Map<String, Inventory> stockBySku = new HashMap<>();
        inventoryRepository.findBySkuCodeIn(skuCode)
                .forEach(inventory -> stockBySku.put(inventory.getSkuCode(), inventory));
        return skuCode.stream()
                .distinct()
                .map(code -> {
                    Inventory inventory = stockBySku.get(code);
                    return InventoryResponse.builder()
                            .skuCode(code)
                            .isInStock(inventory != null && defaultQuantity(inventory.getQuantity()) > 0)
                            .build();
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReceiptResponse> getReceipts() {
        return importReceiptRepository.findAllByOrderByImportDateDesc().stream()
                .map(this::mapReceipt)
                .toList();
    }

    public ReceiptResponse createReceipt(ReceiptRequest request) {
        ImportReceipt receipt = new ImportReceipt();
        receipt.setReceiptNumber("PN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        receipt.setImportDate(request.getImportDate() == null ? now() : request.getImportDate());
        receipt.setStatus(DRAFT);
        receipt.setNote(request.getNote());
        receipt.setItems(mapItems(request.getItems()));
        return mapReceipt(importReceiptRepository.save(receipt));
    }

    public ReceiptResponse updateReceipt(Long id, ReceiptRequest request) {
        ImportReceipt receipt = findReceipt(id);
        if (!DRAFT.equals(receipt.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only draft receipts can be edited");
        }
        receipt.setImportDate(request.getImportDate() == null ? receipt.getImportDate() : request.getImportDate());
        receipt.setNote(request.getNote());
        receipt.setItems(mapItems(request.getItems()));
        return mapReceipt(importReceiptRepository.save(receipt));
    }

    public ReceiptResponse completeReceipt(Long id) {
        ImportReceipt receipt = findReceipt(id);
        if (!DRAFT.equals(receipt.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Receipt already completed");
        }
        receipt.setStatus(COMPLETED);
        receipt.setCompletedAt(now());

        for (ImportReceiptItem item : receipt.getItems()) {
            Inventory inventory = inventoryRepository.findBySkuCode(item.getSkuCode())
                    .orElseGet(() -> {
                        Inventory created = new Inventory();
                        created.setSkuCode(item.getSkuCode());
                        created.setQuantity(0);
                        return created;
                    });
            inventory.setQuantity(defaultQuantity(inventory.getQuantity()) + defaultQuantity(item.getQuantity()));
            inventoryRepository.save(inventory);
            movementRepository.save(movement(item, IN, receipt.getReceiptNumber(), receipt.getCompletedAt()));
            syncProductImport(item, inventory.getQuantity());
        }
        return mapReceipt(importReceiptRepository.save(receipt));
    }

    public void stockOut(StockOutRequest request) {
        String referenceNumber = request.getReferenceNumber();
        if (referenceNumber != null && movementRepository.existsByReferenceNumberAndType(referenceNumber, OUT)) {
            return;
        }
        LocalDateTime now = now();
        for (ReceiptItemRequest item : request.getItems()) {
            Inventory inventory = inventoryRepository.findBySkuCode(item.getSkuCode())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing stock for " + item.getSkuCode()));
            int nextQuantity = defaultQuantity(inventory.getQuantity()) - defaultQuantity(item.getQuantity());
            if (nextQuantity < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient stock for " + item.getSkuCode());
            }
            inventory.setQuantity(nextQuantity);
            inventoryRepository.save(inventory);

            ImportReceiptItem movementItem = new ImportReceiptItem();
            movementItem.setSkuCode(item.getSkuCode());
            movementItem.setProductName(item.getProductName());
            movementItem.setQuantity(item.getQuantity());
            movementItem.setImportPrice(item.getImportPrice() == null ? item.getPrice() : item.getImportPrice());
            movementRepository.save(movement(movementItem, OUT, referenceNumber, now));
        }
    }

    @Transactional(readOnly = true)
    public List<StockResponse> getStock(LocalDateTime at) {
        List<Inventory> inventories = inventoryRepository.findAll();
        if (at == null) {
            return inventories.stream()
                    .map(item -> StockResponse.builder().skuCode(item.getSkuCode()).quantity(defaultQuantity(item.getQuantity())).build())
                    .toList();
        }
        Map<String, Integer> quantities = new HashMap<>();
        inventories.forEach(item -> quantities.put(item.getSkuCode(), defaultQuantity(item.getQuantity())));
        movementRepository.findByOccurredAtAfter(at).forEach(movement -> {
            int delta = defaultQuantity(movement.getQuantity());
            quantities.merge(movement.getSkuCode(), IN.equals(movement.getType()) ? -delta : delta, Integer::sum);
        });
        return quantities.entrySet().stream()
                .map(entry -> StockResponse.builder().skuCode(entry.getKey()).quantity(entry.getValue()).build())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MovementResponse> getMovements(LocalDateTime from, LocalDateTime to) {
        LocalDateTime start = from == null ? now().minusMonths(1) : from;
        LocalDateTime end = to == null ? now() : to;
        return movementRepository.findByOccurredAtBetweenOrderByOccurredAtDesc(start, end).stream()
                .map(this::mapMovement)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<StockResponse> getLowStock(int threshold) {
        return inventoryRepository.findAll().stream()
                .filter(item -> defaultQuantity(item.getQuantity()) <= threshold)
                .map(item -> StockResponse.builder().skuCode(item.getSkuCode()).quantity(defaultQuantity(item.getQuantity())).build())
                .toList();
    }

    private ImportReceipt findReceipt(Long id) {
        return importReceiptRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receipt not found"));
    }

    private List<ImportReceiptItem> mapItems(List<ReceiptItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Receipt must contain at least one item");
        }
        return items.stream().map(item -> {
            ImportReceiptItem entity = new ImportReceiptItem();
            entity.setSkuCode(item.getSkuCode());
            entity.setProductName(item.getProductName());
            entity.setImportPrice(defaultMoney(item.getImportPrice()));
            entity.setQuantity(defaultQuantity(item.getQuantity()));
            return entity;
        }).toList();
    }

    private InventoryMovement movement(ImportReceiptItem item, String type, String referenceNumber, LocalDateTime occurredAt) {
        InventoryMovement movement = new InventoryMovement();
        movement.setSkuCode(item.getSkuCode());
        movement.setProductName(item.getProductName());
        movement.setType(type);
        movement.setQuantity(defaultQuantity(item.getQuantity()));
        movement.setUnitPrice(defaultMoney(item.getImportPrice()));
        movement.setOccurredAt(occurredAt);
        movement.setReferenceNumber(referenceNumber);
        return movement;
    }

    private ReceiptResponse mapReceipt(ImportReceipt receipt) {
        return ReceiptResponse.builder()
                .id(receipt.getId())
                .receiptNumber(receipt.getReceiptNumber())
                .importDate(receipt.getImportDate())
                .completedAt(receipt.getCompletedAt())
                .status(receipt.getStatus())
                .note(receipt.getNote())
                .items(receipt.getItems().stream().map(item -> ReceiptItemResponse.builder()
                        .id(item.getId())
                        .skuCode(item.getSkuCode())
                        .productName(item.getProductName())
                        .importPrice(item.getImportPrice())
                        .quantity(item.getQuantity())
                        .build()).toList())
                .build();
    }

    private MovementResponse mapMovement(InventoryMovement movement) {
        return MovementResponse.builder()
                .id(movement.getId())
                .skuCode(movement.getSkuCode())
                .productName(movement.getProductName())
                .type(movement.getType())
                .quantity(movement.getQuantity())
                .unitPrice(movement.getUnitPrice())
                .occurredAt(movement.getOccurredAt())
                .referenceNumber(movement.getReferenceNumber())
                .build();
    }

    private void syncProductImport(ImportReceiptItem item, Integer stockQuantity) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("skuCode", item.getSkuCode());
            payload.put("lastImportPrice", item.getImportPrice());
            payload.put("stockQuantity", stockQuantity);
            restTemplate.put("http://product-service/api/product/admin/import-sync", payload);
        } catch (Exception exception) {
            log.warn("Could not sync product import data for {}", item.getSkuCode());
        }
    }

    private Integer defaultQuantity(Integer value) {
        return value == null ? 0 : value;
    }

    private BigDecimal defaultMoney(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private LocalDateTime now() {
        return LocalDateTime.now(VIETNAM_ZONE);
    }
}
