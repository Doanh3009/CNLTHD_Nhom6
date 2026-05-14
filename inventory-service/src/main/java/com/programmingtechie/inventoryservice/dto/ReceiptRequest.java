package com.programmingtechie.inventoryservice.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReceiptRequest {
    private LocalDateTime importDate;
    private String note;
    private List<ReceiptItemRequest> items;
}

