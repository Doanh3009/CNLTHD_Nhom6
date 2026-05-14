package com.programmingtechie.orderservice.service;

import com.programmingtechie.orderservice.dto.InventoryResponse;
import com.programmingtechie.orderservice.dto.OrderLineItemsDto;
import com.programmingtechie.orderservice.dto.OrderRequest;
import com.programmingtechie.orderservice.dto.OrderResponse;
import com.programmingtechie.orderservice.dto.StockOutRequest;
import com.programmingtechie.orderservice.event.OrderPlacedEvent;
import com.programmingtechie.orderservice.model.Order;
import com.programmingtechie.orderservice.model.OrderLineItems;
import com.programmingtechie.orderservice.repository.OrderRepository;
import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final WebClient.Builder webClientBuilder;
    private final ObservationRegistry observationRegistry;
    private final ApplicationEventPublisher applicationEventPublisher;

    public OrderResponse placeOrder(OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setUsername(orderRequest.getUsername());
        order.setCustomerName(orderRequest.getCustomerName());
        order.setPhone(orderRequest.getPhone());
        order.setShippingAddress(orderRequest.getShippingAddress());
        order.setWard(orderRequest.getWard());
        order.setNote(orderRequest.getNote());
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setCouponCode(orderRequest.getCouponCode());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        List<OrderLineItems> orderLineItems = orderRequest.getOrderLineItemsDtoList()
                .stream()
                .map(this::mapToDto)
                .toList();

        order.setOrderLineItemsList(orderLineItems);
        order.setSubtotal(resolveSubtotal(orderRequest, orderLineItems));
        order.setShippingFee(defaultMoney(orderRequest.getShippingFee()));
        order.setDiscountAmount(resolveDiscount(orderRequest.getCouponCode(), order.getSubtotal(), orderRequest.getDiscountAmount()));
        order.setTotalAmount(order.getSubtotal()
                .subtract(order.getDiscountAmount())
                .add(order.getShippingFee()));

        List<String> skuCodes = order.getOrderLineItemsList().stream()
                .map(OrderLineItems::getSkuCode)
                .toList();

        // Call Inventory Service, and place order if product is in
        // stock
        Observation inventoryServiceObservation = Observation.createNotStarted("inventory-service-lookup",
                this.observationRegistry);
        inventoryServiceObservation.lowCardinalityKeyValue("call", "inventory-service");
        return inventoryServiceObservation.observe(() -> {
            InventoryResponse[] inventoryResponseArray = webClientBuilder.build().get()
                    .uri("http://inventory-service/api/inventory",
                            uriBuilder -> uriBuilder.queryParam("skuCode", skuCodes).build())
                    .retrieve()
                    .bodyToMono(InventoryResponse[].class)
                    .block();

            boolean allProductsInStock = Arrays.stream(inventoryResponseArray)
                    .allMatch(InventoryResponse::isInStock);

            if (allProductsInStock) {
                Order savedOrder = orderRepository.save(order);
                // publish Order Placed Event
                applicationEventPublisher.publishEvent(new OrderPlacedEvent(this, savedOrder.getOrderNumber()));
                return mapToResponse(savedOrder);
            } else {
                throw new IllegalArgumentException("Product is not in stock, please try again later");
            }
        });

    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String username, LocalDateTime from, LocalDateTime to, String status, String ward, String sort) {
        List<Order> orders = (username == null || username.isBlank())
                ? orderRepository.findAllByOrderByCreatedAtDesc()
                : orderRepository.findByUsernameOrderByCreatedAtDesc(username);
        return orders.stream()
                .filter(order -> from == null || !order.getCreatedAt().isBefore(from))
                .filter(order -> to == null || !order.getCreatedAt().isAfter(to))
                .filter(order -> status == null || status.isBlank() || status.equalsIgnoreCase(order.getStatus()))
                .filter(order -> ward == null || ward.isBlank() || (order.getWard() != null && order.getWard().toLowerCase().contains(ward.toLowerCase())))
                .sorted(resolveSort(sort))
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(String orderNumber) {
        return mapToResponse(findByOrderNumber(orderNumber));
    }

    public OrderResponse updateStatus(String orderNumber, String status) {
        Order order = findByOrderNumber(orderNumber);
        String nextStatus = status == null || status.isBlank() ? order.getStatus() : status.trim().toUpperCase();
        if ("COMPLETED".equals(nextStatus) && !"COMPLETED".equalsIgnoreCase(order.getStatus())) {
            stockOut(order);
        }
        order.setStatus(nextStatus);
        return mapToResponse(orderRepository.save(order));
    }

    private OrderLineItems mapToDto(OrderLineItemsDto orderLineItemsDto) {
        OrderLineItems orderLineItems = new OrderLineItems();
        orderLineItems.setPrice(orderLineItemsDto.getPrice());
        orderLineItems.setQuantity(orderLineItemsDto.getQuantity());
        orderLineItems.setSkuCode(orderLineItemsDto.getSkuCode());
        orderLineItems.setProductName(orderLineItemsDto.getProductName());
        orderLineItems.setImageUrl(orderLineItemsDto.getImageUrl());
        return orderLineItems;
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .username(order.getUsername())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .shippingAddress(order.getShippingAddress())
                .ward(order.getWard())
                .note(order.getNote())
                .paymentMethod(order.getPaymentMethod())
                .couponCode(order.getCouponCode())
                .status(order.getStatus())
                .subtotal(order.getSubtotal())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(order.getOrderLineItemsList().stream().map(this::mapLineItemToResponse).toList())
                .build();
    }

    private OrderLineItemsDto mapLineItemToResponse(OrderLineItems lineItem) {
        OrderLineItemsDto dto = new OrderLineItemsDto();
        dto.setId(lineItem.getId());
        dto.setSkuCode(lineItem.getSkuCode());
        dto.setProductName(lineItem.getProductName());
        dto.setImageUrl(lineItem.getImageUrl());
        dto.setPrice(lineItem.getPrice());
        dto.setQuantity(lineItem.getQuantity());
        return dto;
    }

    private Order findByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    private Comparator<Order> resolveSort(String sort) {
        if ("ward".equalsIgnoreCase(sort)) {
            return Comparator.comparing(order -> order.getWard() == null ? "" : order.getWard(), String.CASE_INSENSITIVE_ORDER);
        }
        if ("createdAtAsc".equalsIgnoreCase(sort)) {
            return Comparator.comparing(Order::getCreatedAt);
        }
        return Comparator.comparing(Order::getCreatedAt).reversed();
    }

    private void stockOut(Order order) {
        StockOutRequest request = new StockOutRequest();
        request.setReferenceNumber(order.getOrderNumber());
        request.setItems(order.getOrderLineItemsList().stream().map(this::mapLineItemToResponse).toList());
        webClientBuilder.build().post()
                .uri("http://inventory-service/api/inventory/stock-out")
                .bodyValue(request)
                .retrieve()
                .toBodilessEntity()
                .block();
    }

    private BigDecimal resolveSubtotal(OrderRequest orderRequest, List<OrderLineItems> orderLineItems) {
        if (orderRequest.getSubtotal() != null) {
            return orderRequest.getSubtotal();
        }
        return orderLineItems.stream()
                .map(item -> defaultMoney(item.getPrice()).multiply(BigDecimal.valueOf(item.getQuantity() == null ? 0 : item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal resolveDiscount(String couponCode, BigDecimal subtotal, BigDecimal clientDiscount) {
        if (clientDiscount != null) {
            return clientDiscount;
        }
        if (couponCode == null) {
            return BigDecimal.ZERO;
        }
        String normalized = couponCode.trim().toUpperCase();
        if ("TECH10".equals(normalized)) {
            return subtotal.multiply(BigDecimal.valueOf(0.10));
        }
        if ("VIP20".equals(normalized)) {
            return subtotal.multiply(BigDecimal.valueOf(0.20));
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal defaultMoney(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
