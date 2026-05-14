package com.programmingtechie.inventoryservice.controller;

import com.programmingtechie.inventoryservice.dto.*;
import com.programmingtechie.inventoryservice.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<InventoryResponse> isInStock(@RequestParam List<String> skuCode) {
        return inventoryService.isInStock(skuCode);
    }

    @GetMapping("/receipts")
    @ResponseStatus(HttpStatus.OK)
    public List<ReceiptResponse> getReceipts() {
        return inventoryService.getReceipts();
    }

    @PostMapping("/receipts")
    @ResponseStatus(HttpStatus.CREATED)
    public ReceiptResponse createReceipt(@RequestBody ReceiptRequest request) {
        return inventoryService.createReceipt(request);
    }

    @PutMapping("/receipts/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ReceiptResponse updateReceipt(@PathVariable Long id, @RequestBody ReceiptRequest request) {
        return inventoryService.updateReceipt(id, request);
    }

    @PutMapping("/receipts/{id}/complete")
    @ResponseStatus(HttpStatus.OK)
    public ReceiptResponse completeReceipt(@PathVariable Long id) {
        return inventoryService.completeReceipt(id);
    }

    @PostMapping("/stock-out")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void stockOut(@RequestBody StockOutRequest request) {
        inventoryService.stockOut(request);
    }

    @GetMapping("/stock")
    @ResponseStatus(HttpStatus.OK)
    public List<StockResponse> getStock(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime at
    ) {
        return inventoryService.getStock(at);
    }

    @GetMapping("/reports/movement")
    @ResponseStatus(HttpStatus.OK)
    public List<MovementResponse> getMovements(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        return inventoryService.getMovements(from, to);
    }

    @GetMapping("/low-stock")
    @ResponseStatus(HttpStatus.OK)
    public List<StockResponse> getLowStock(@RequestParam(defaultValue = "5") int threshold) {
        return inventoryService.getLowStock(threshold);
    }
}

