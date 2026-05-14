package com.programmingtechie.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderRequest {
    private String username;
    private String customerName;
    private String phone;
    private String shippingAddress;
    private String ward;
    private String note;
    private String paymentMethod;
    private String couponCode;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private List<OrderLineItemsDto> orderLineItemsDtoList;
}
