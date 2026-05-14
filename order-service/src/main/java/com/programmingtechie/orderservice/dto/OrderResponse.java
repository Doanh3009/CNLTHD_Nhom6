package com.programmingtechie.orderservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String username;
    private String customerName;
    private String phone;
    private String shippingAddress;
    private String ward;
    private String note;
    private String paymentMethod;
    private String couponCode;
    private String status;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
    private List<OrderLineItemsDto> items;
}
