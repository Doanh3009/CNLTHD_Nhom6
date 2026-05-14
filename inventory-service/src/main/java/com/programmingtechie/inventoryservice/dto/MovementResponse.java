package com.programmingtechie.inventoryservice.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class MovementResponse {
    private Long id;
    private String skuCode;
    private String productName;
    private String type;
    private Integer quantity;
    private BigDecimal unitPrice;
    private LocalDateTime occurredAt;
    private String referenceNumber;
}

