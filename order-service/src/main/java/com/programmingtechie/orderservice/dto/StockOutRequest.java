package com.programmingtechie.orderservice.dto;

import lombok.Data;

import java.util.List;

@Data
public class StockOutRequest {
    private String referenceNumber;
    private List<OrderLineItemsDto> items;
}

