package com.programmingtechie.inventoryservice.service;

import com.programmingtechie.inventoryservice.dto.InventoryRequest;
import com.programmingtechie.inventoryservice.dto.InventoryResponse;
import com.programmingtechie.inventoryservice.dto.StockReservationRequest;
import com.programmingtechie.inventoryservice.dto.StockReservationResponse;
import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    @Transactional(readOnly = true)
    public List<InventoryResponse> isInStock(List<String> skuCode) {
        log.info("Checking inventory for {}", skuCode);
        return inventoryRepository.findBySkuCodeIn(normalize(skuCode)).stream()
                .map(inventory -> InventoryResponse.builder()
                        .skuCode(inventory.getSkuCode())
                        .isInStock(inventory.getQuantity() > 0)
                        .quantity(inventory.getQuantity())
                        .build())
                .toList();
    }

    @Transactional
    public InventoryResponse upsertStock(InventoryRequest request) {
        validate(request);
        String skuCode = normalize(request.getSkuCode());
        Inventory inventory = inventoryRepository.findBySkuCode(skuCode).orElseGet(Inventory::new);
        inventory.setSkuCode(skuCode);
        inventory.setQuantity(request.getQuantity());
        return map(inventoryRepository.save(inventory));
    }

    @Transactional
    public synchronized StockReservationResponse reserveStock(StockReservationRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Reservation items are required");
        }

        List<String> unavailableSkuCodes = new ArrayList<>();
        for (InventoryRequest item : request.getItems()) {
            validate(item);
            Inventory inventory = inventoryRepository.findBySkuCode(normalize(item.getSkuCode())).orElse(null);
            if (inventory == null || inventory.getQuantity() < item.getQuantity()) {
                unavailableSkuCodes.add(normalize(item.getSkuCode()));
            }
        }

        if (!unavailableSkuCodes.isEmpty()) {
            return StockReservationResponse.builder()
                    .reserved(false)
                    .unavailableSkuCodes(unavailableSkuCodes)
                    .build();
        }

        for (InventoryRequest item : request.getItems()) {
            Inventory inventory = inventoryRepository.findBySkuCode(normalize(item.getSkuCode()))
                    .orElseThrow(() -> new IllegalStateException("Inventory changed while reserving stock"));
            inventory.setQuantity(inventory.getQuantity() - item.getQuantity());
            inventoryRepository.save(inventory);
        }

        return StockReservationResponse.builder()
                .reserved(true)
                .unavailableSkuCodes(List.of())
                .build();
    }

    private InventoryResponse map(Inventory inventory) {
        return InventoryResponse.builder()
                .skuCode(inventory.getSkuCode())
                .isInStock(inventory.getQuantity() > 0)
                .quantity(inventory.getQuantity())
                .build();
    }

    private void validate(InventoryRequest request) {
        if (request == null || request.getSkuCode() == null || request.getSkuCode().isBlank()
                || request.getQuantity() == null || request.getQuantity() < 0) {
            throw new IllegalArgumentException("SKU and non-negative quantity are required");
        }
    }

    private List<String> normalize(List<String> skuCodes) {
        return skuCodes.stream().map(this::normalize).toList();
    }

    private String normalize(String skuCode) {
        return skuCode.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]", "_");
    }
}
