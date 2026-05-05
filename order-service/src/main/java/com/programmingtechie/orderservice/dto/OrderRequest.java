package com.programmingtechie.orderservice.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private List<OrderLineItemsDto> orderLineItemsDtoList;
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private String note;
    private String paymentMethod;
}
