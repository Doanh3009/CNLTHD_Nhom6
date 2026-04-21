package com.programmingtechie.orderservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone; // <-- Đã thêm import

@SpringBootApplication
public class OrderServiceApplication {

    public static void main(String[] args) {
        // <-- Đã thêm lệnh ép múi giờ về chuẩn quốc tế UTC
        TimeZone.setDefault(TimeZone.getTimeZone("UTC")); 
        
        SpringApplication.run(OrderServiceApplication.class, args);
    }

}