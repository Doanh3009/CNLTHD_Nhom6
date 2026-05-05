package com.programmingtechie.inventoryservice.controller;

import com.programmingtechie.inventoryservice.dto.InventoryRequest;
import com.programmingtechie.inventoryservice.dto.InventoryResponse;
import com.programmingtechie.inventoryservice.dto.StockReservationRequest;
import com.programmingtechie.inventoryservice.dto.StockReservationResponse;
import com.programmingtechie.inventoryservice.service.InventoryService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@Slf4j
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> isInStock(@RequestParam List<String> skuCode) {
        log.info("Received inventory check request for skuCode: {}", skuCode);
        return inventoryService.isInStock(skuCode);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    public InventoryResponse upsertStock(@RequestBody InventoryRequest request) {
        return inventoryService.upsertStock(request);
    }

    @PostMapping("/reserve")
    @ResponseStatus(HttpStatus.OK)
    public StockReservationResponse reserveStock(@RequestBody StockReservationRequest request) {
        return inventoryService.reserveStock(request);
    }
}
