package com.programmingtechie.inventoryservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockResponse {
    private String skuCode;
    private Integer quantity;
}

