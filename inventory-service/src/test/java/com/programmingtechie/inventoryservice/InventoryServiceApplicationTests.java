package com.programmingtechie.inventoryservice;

import com.programmingtechie.inventoryservice.dto.ReceiptItemRequest;
import com.programmingtechie.inventoryservice.dto.StockOutRequest;
import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.model.InventoryMovement;
import com.programmingtechie.inventoryservice.repository.ImportReceiptRepository;
import com.programmingtechie.inventoryservice.repository.InventoryMovementRepository;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import com.programmingtechie.inventoryservice.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InventoryServiceApplicationTests {

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private ImportReceiptRepository importReceiptRepository;

    @Mock
    private InventoryMovementRepository movementRepository;

    @Mock
    private RestTemplate restTemplate;

    private InventoryService inventoryService;

    @BeforeEach
    void setUp() {
        inventoryService = new InventoryService(inventoryRepository, importReceiptRepository, movementRepository, restTemplate);
    }

    @Test
    void isInStockReturnsFalseForMissingOrEmptySku() {
        Inventory available = new Inventory();
        available.setSkuCode("iphone_15");
        available.setQuantity(2);
        Inventory empty = new Inventory();
        empty.setSkuCode("ipad_air");
        empty.setQuantity(0);
        when(inventoryRepository.findBySkuCodeIn(List.of("iphone_15", "ipad_air", "unknown")))
                .thenReturn(List.of(available, empty));

        var result = inventoryService.isInStock(List.of("iphone_15", "ipad_air", "unknown"));

        assertTrue(result.get(0).isInStock());
        assertFalse(result.get(1).isInStock());
        assertFalse(result.get(2).isInStock());
    }

    @Test
    void stockOutDecrementsInventoryAndRecordsMovement() {
        Inventory inventory = new Inventory();
        inventory.setSkuCode("watch_ultra");
        inventory.setQuantity(5);
        when(movementRepository.existsByReferenceNumberAndType("order-1", "OUT")).thenReturn(false);
        when(inventoryRepository.findBySkuCode("watch_ultra")).thenReturn(Optional.of(inventory));

        inventoryService.stockOut(stockOutRequest("order-1", "watch_ultra", 2));

        assertEquals(3, inventory.getQuantity());
        verify(inventoryRepository).save(inventory);
        ArgumentCaptor<InventoryMovement> captor = ArgumentCaptor.forClass(InventoryMovement.class);
        verify(movementRepository).save(captor.capture());
        assertEquals("OUT", captor.getValue().getType());
        assertEquals("order-1", captor.getValue().getReferenceNumber());
        assertEquals(2, captor.getValue().getQuantity());
    }

    @Test
    void stockOutIsIdempotentForExistingReference() {
        when(movementRepository.existsByReferenceNumberAndType("order-2", "OUT")).thenReturn(true);

        inventoryService.stockOut(stockOutRequest("order-2", "watch_ultra", 1));

        verify(inventoryRepository, never()).save(any());
        verify(movementRepository, never()).save(any());
    }

    @Test
    void stockOutRejectsInsufficientStock() {
        Inventory inventory = new Inventory();
        inventory.setSkuCode("watch_ultra");
        inventory.setQuantity(1);
        when(movementRepository.existsByReferenceNumberAndType("order-3", "OUT")).thenReturn(false);
        when(inventoryRepository.findBySkuCode("watch_ultra")).thenReturn(Optional.of(inventory));

        assertThrows(ResponseStatusException.class, () -> inventoryService.stockOut(stockOutRequest("order-3", "watch_ultra", 2)));
    }

    private StockOutRequest stockOutRequest(String referenceNumber, String skuCode, int quantity) {
        ReceiptItemRequest item = new ReceiptItemRequest();
        item.setSkuCode(skuCode);
        item.setProductName("Apple Watch Ultra 2");
        item.setQuantity(quantity);
        item.setPrice(BigDecimal.valueOf(21_990_000));
        StockOutRequest request = new StockOutRequest();
        request.setReferenceNumber(referenceNumber);
        request.setItems(List.of(item));
        return request;
    }
}
