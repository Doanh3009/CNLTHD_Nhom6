package com.programmingtechie.orderservice.dto;

import com.programmingtechie.orderservice.model.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private String orderNumber;
    private String customerName;
    private String customerPhone;
    private String shippingAddress;
    private String note;
    private String paymentMethod;
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal discount;
    private BigDecimal total;
    private OrderStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private List<OrderLineItemsDto> items;
}
