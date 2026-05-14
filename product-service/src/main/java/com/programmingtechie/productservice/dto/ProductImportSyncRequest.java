package com.programmingtechie.productservice.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductImportSyncRequest {
    private String skuCode;
    private BigDecimal lastImportPrice;
    private Integer stockQuantity;
}

