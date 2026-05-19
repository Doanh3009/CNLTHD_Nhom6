package com.programming.techie;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class OrderPlacedEventTests {

    @Test
    void storesOrderNumberForNotificationPayload() {
        OrderPlacedEvent event = new OrderPlacedEvent("order-123");

        assertEquals("order-123", event.getOrderNumber());
    }
}
