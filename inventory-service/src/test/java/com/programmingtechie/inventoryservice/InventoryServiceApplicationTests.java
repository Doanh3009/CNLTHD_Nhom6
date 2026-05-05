package com.programmingtechie.inventoryservice;

import com.programmingtechie.inventoryservice.dto.InventoryRequest;
import com.programmingtechie.inventoryservice.dto.StockReservationRequest;
import com.programmingtechie.inventoryservice.dto.StockReservationResponse;
import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import com.programmingtechie.inventoryservice.service.InventoryService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class InventoryServiceApplicationTests {

    @Test
    void shouldReserveStockAndDecreaseQuantity() {
        InventoryRepository repository = Mockito.mock(InventoryRepository.class);
        Inventory inventory = new Inventory(1L, "iphone_15", 5);
        Mockito.when(repository.findBySkuCode("iphone_15")).thenReturn(Optional.of(inventory));
        Mockito.when(repository.save(Mockito.any(Inventory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InventoryService inventoryService = new InventoryService(repository);

        StockReservationResponse response = inventoryService.reserveStock(
                new StockReservationRequest(List.of(new InventoryRequest("iphone_15", 2))));

        Assertions.assertTrue(response.isReserved());
        Assertions.assertEquals(3, inventory.getQuantity());
    }

    @Test
    void shouldRejectReservationWhenStockIsNotEnough() {
        InventoryRepository repository = Mockito.mock(InventoryRepository.class);
        Inventory inventory = new Inventory(1L, "iphone_15", 1);
        Mockito.when(repository.findBySkuCode("iphone_15")).thenReturn(Optional.of(inventory));

        InventoryService inventoryService = new InventoryService(repository);

        StockReservationResponse response = inventoryService.reserveStock(
                new StockReservationRequest(List.of(new InventoryRequest("iphone_15", 2))));

        Assertions.assertFalse(response.isReserved());
        Assertions.assertEquals(List.of("iphone_15"), response.getUnavailableSkuCodes());
        Assertions.assertEquals(1, inventory.getQuantity());
    }
}
