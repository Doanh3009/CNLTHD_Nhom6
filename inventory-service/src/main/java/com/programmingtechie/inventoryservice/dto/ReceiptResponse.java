package com.programmingtechie.inventoryservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReceiptResponse {
    private Long id;
    private String receiptNumber;
    private LocalDateTime importDate;
    private LocalDateTime completedAt;
    private String status;
    private String note;
    private List<ReceiptItemResponse> items;
}

