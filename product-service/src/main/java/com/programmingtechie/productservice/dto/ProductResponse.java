package com.programmingtechie.productservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private String id;
    private String skuCode;
    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String imageUrl;
    private Integer stockQuantity;
    private String unit;
    private BigDecimal lastImportPrice;
    private BigDecimal profitMarginPercent;
    private String status;
    private Boolean hasImportHistory;
}
