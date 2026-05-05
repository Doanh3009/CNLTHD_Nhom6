package com.programmingtechie.orderservice.service;

import com.programmingtechie.orderservice.dto.InventoryRequest;
import com.programmingtechie.orderservice.dto.OrderLineItemsDto;
import com.programmingtechie.orderservice.dto.OrderRequest;
import com.programmingtechie.orderservice.dto.OrderResponse;
import com.programmingtechie.orderservice.dto.StockReservationRequest;
import com.programmingtechie.orderservice.dto.StockReservationResponse;
import com.programmingtechie.orderservice.event.OrderPlacedEvent;
import com.programmingtechie.orderservice.model.Order;
import com.programmingtechie.orderservice.model.OrderLineItems;
import com.programmingtechie.orderservice.model.OrderStatus;
import com.programmingtechie.orderservice.repository.OrderRepository;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

    private static final BigDecimal FREE_SHIPPING = BigDecimal.ZERO;
    private static final BigDecimal NO_DISCOUNT = BigDecimal.ZERO;

    private final OrderRepository orderRepository;
    private final WebClient.Builder webClientBuilder;
    private final ObservationRegistry observationRegistry;
    private final ApplicationEventPublisher applicationEventPublisher;

    public OrderResponse placeOrder(OrderRequest orderRequest) {
        validate(orderRequest);

        List<OrderLineItems> orderLineItems = orderRequest.getOrderLineItemsDtoList()
                .stream()
                .map(this::mapToEntity)
                .toList();

        StockReservationResponse reservation = reserveInventory(orderLineItems);
        if (reservation == null || !reservation.isReserved()) {
            throw new IllegalArgumentException("Products are not in stock: "
                    + (reservation == null ? "" : reservation.getUnavailableSkuCodes()));
        }

        Instant now = Instant.now();
        BigDecimal subtotal = orderLineItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setCustomerName(orderRequest.getCustomerName().trim());
        order.setCustomerPhone(orderRequest.getCustomerPhone().trim());
        order.setShippingAddress(orderRequest.getShippingAddress().trim());
        order.setNote(orderRequest.getNote());
        order.setPaymentMethod(defaultPaymentMethod(orderRequest.getPaymentMethod()));
        order.setSubtotal(subtotal);
        order.setShippingFee(FREE_SHIPPING);
        order.setDiscount(NO_DISCOUNT);
        order.setTotal(subtotal.add(FREE_SHIPPING).subtract(NO_DISCOUNT));
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(now);
        order.setUpdatedAt(now);
        order.setOrderLineItemsList(orderLineItems);

        Order savedOrder = orderRepository.save(order);
        applicationEventPublisher.publishEvent(new OrderPlacedEvent(this, savedOrder.getOrderNumber()));
        return mapToResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .map(this::mapToResponse)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));
    }

    public OrderResponse updateStatus(String orderNumber, OrderStatus status) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderNumber));
        order.setStatus(status);
        order.setUpdatedAt(Instant.now());
        return mapToResponse(orderRepository.save(order));
    }

    private StockReservationResponse reserveInventory(List<OrderLineItems> orderLineItems) {
        StockReservationRequest request = new StockReservationRequest(orderLineItems.stream()
                .map(item -> new InventoryRequest(item.getSkuCode(), item.getQuantity()))
                .toList());

        Observation observation = Observation.createNotStarted("inventory-service-reserve", observationRegistry);
        observation.lowCardinalityKeyValue("call", "inventory-service");
        return observation.observe(() -> webClientBuilder.build().post()
                .uri("http://inventory-service/api/inventory/reserve")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(StockReservationResponse.class)
                .block());
    }

    private OrderLineItems mapToEntity(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setPrice(orderLineItemsDto.getPrice());
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItems.setSkuCode(orderLineItemsDto.getSkuCode());
        orderLineItems.setProductName(orderLineItemsDto.getProductName());
        return orderLineItems;
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .orderNumber(order.getOrderNumber())
                .customerName(order.getCustomerName())
                .customerPhone(order.getCustomerPhone())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .paymentMethod(order.getPaymentMethod())
                .subtotal(order.getSubtotal())
                .shippingFee(order.getShippingFee())
                .discount(order.getDiscount())
                .total(order.getTotal())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(order.getOrderLineItemsList().stream().map(this::mapToDto).toList())
                .build();
    }

    private OrderLineItemsDto mapToDto(OrderLineItems item) {
        return new OrderLineItemsDto(item.getId(), item.getSkuCode(), item.getProductName(),
                item.getPrice(), item.getQuantity());
    }

    private void validate(OrderRequest orderRequest) {
        if (orderRequest == null || orderRequest.getOrderLineItemsDtoList() == null
                || orderRequest.getOrderLineItemsDtoList().isEmpty()
                || isBlank(orderRequest.getCustomerName())
                || isBlank(orderRequest.getCustomerPhone())
                || isBlank(orderRequest.getShippingAddress())) {
            throw new IllegalArgumentException("Order items, customer name, phone and address are required");
        }

        for (OrderLineItemsDto item : orderRequest.getOrderLineItemsDtoList()) {
            if (item.getSkuCode() == null || item.getSkuCode().isBlank()
                    || item.getPrice() == null || item.getPrice().compareTo(BigDecimal.ZERO) <= 0
                    || item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Each order item must have SKU, positive price and quantity");
            }
        }
    }

    private String defaultPaymentMethod(String paymentMethod) {
        return isBlank(paymentMethod) ? "COD" : paymentMethod.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
