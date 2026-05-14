package com.programmingtechie.inventoryservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ReceiptItemRequest {
    private String skuCode;
    private String productName;
    private BigDecimal importPrice;
    private BigDecimal price;
    private Integer quantity;
}
