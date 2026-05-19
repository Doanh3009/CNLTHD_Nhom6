package com.programmingtechie.orderservice;

import com.programmingtechie.orderservice.dto.OrderResponse;
import com.programmingtechie.orderservice.model.Order;
import com.programmingtechie.orderservice.repository.OrderRepository;
import com.programmingtechie.orderservice.service.OrderService;
import io.micrometer.observation.ObservationRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceApplicationTests {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private WebClient.Builder webClientBuilder;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, webClientBuilder, ObservationRegistry.create(), eventPublisher);
    }

    @Test
    void getOrdersFiltersByStatusWardAndSortsNewestFirst() {
        Order newestPending = order("o-1", "khang", "PENDING", "p2", LocalDateTime.of(2026, 5, 19, 9, 5));
        Order completed = order("o-2", "khang", "COMPLETED", "p2", LocalDateTime.of(2026, 5, 19, 8, 0));
        Order otherWard = order("o-3", "khang", "PENDING", "p7", LocalDateTime.of(2026, 5, 19, 10, 0));
        when(orderRepository.findByUsernameOrderByCreatedAtDesc("khang"))
                .thenReturn(List.of(otherWard, newestPending, completed));

        List<OrderResponse> result = orderService.getOrders("khang", null, null, "PENDING", "p2", "newest");

        assertEquals(1, result.size());
        assertEquals("o-1", result.get(0).getOrderNumber());
        assertEquals("PENDING", result.get(0).getStatus());
    }

    @Test
    void updateStatusCanCancelOrderWithoutCallingInventory() {
        Order pending = order("o-9", "doanh", "PENDING", "p2", LocalDateTime.of(2026, 5, 19, 9, 5));
        when(orderRepository.findByOrderNumber("o-9")).thenReturn(Optional.of(pending));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.updateStatus("o-9", "cancelled");

        assertEquals("CANCELLED", response.getStatus());
        verify(orderRepository).save(pending);
        verifyNoInteractions(webClientBuilder);
        verify(eventPublisher, never()).publishEvent(any());
    }

    private Order order(String number, String username, String status, String ward, LocalDateTime createdAt) {
        Order order = new Order();
        order.setOrderNumber(number);
        order.setUsername(username);
        order.setCustomerName(username);
        order.setPhone("0912345678");
        order.setShippingAddress("12 Nguyen Trai");
        order.setWard(ward);
        order.setPaymentMethod("COD");
        order.setStatus(status);
        order.setSubtotal(BigDecimal.valueOf(100_000));
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setShippingFee(BigDecimal.ZERO);
        order.setTotalAmount(BigDecimal.valueOf(100_000));
        order.setCreatedAt(createdAt);
        order.setOrderLineItemsList(List.of());
        return order;
    }
}
