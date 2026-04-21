package com.programmingtechie.inventoryservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone; // <-- Đã thêm import

@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        // <-- Đã thêm lệnh ép múi giờ về chuẩn quốc tế UTC
        TimeZone.setDefault(TimeZone.getTimeZone("UTC")); 
        
        SpringApplication.run(InventoryServiceApplication.class, args);
    }
}