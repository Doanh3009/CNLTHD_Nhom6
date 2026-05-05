package com.programmingtechie.orderservice;

import com.programmingtechie.orderservice.dto.OrderLineItemsDto;
import com.programmingtechie.orderservice.dto.OrderRequest;
import com.programmingtechie.orderservice.service.OrderService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class OrderServiceApplicationTests {

    @Test
    void shouldRejectOrderWithoutShippingInformation() {
        OrderService orderService = new OrderService(null, null, null, null);

        OrderRequest request = new OrderRequest(
                List.of(new OrderLineItemsDto(null, "iphone_15", "iPhone 15", BigDecimal.valueOf(1000), 1)),
                "", "", "", "", "COD");

        Assertions.assertThrows(IllegalArgumentException.class, () -> orderService.placeOrder(request));
    }

    @Test
    void shouldRejectOrderItemWithoutPositiveQuantity() {
        OrderService orderService = new OrderService(null, null, null, null);

        OrderRequest request = new OrderRequest(
                List.of(new OrderLineItemsDto(null, "iphone_15", "iPhone 15", BigDecimal.valueOf(1000), 0)),
                "Nguyen Van A", "0901234567", "123 Nguyen Trai", "", "COD");

        Assertions.assertThrows(IllegalArgumentException.class, () -> orderService.placeOrder(request));
    }
}
