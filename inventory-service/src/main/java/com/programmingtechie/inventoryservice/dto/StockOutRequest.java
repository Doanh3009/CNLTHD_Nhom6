package com.programmingtechie.inventoryservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class StockOutRequest {
    private String referenceNumber;
    private List<ReceiptItemRequest> items;
}

