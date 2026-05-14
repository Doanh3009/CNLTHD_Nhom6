package com.programmingtechie.inventoryservice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ReceiptItemResponse {
    private Long id;
    private String skuCode;
    private String productName;
    private BigDecimal importPrice;
    private Integer quantity;
}

