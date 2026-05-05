package com.programmingtechie.inventoryservice.util;

import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final InventoryRepository inventoryRepository;

    @Override
    public void run(String... args) {
        if (inventoryRepository.count() > 0) {
            return;
        }

        inventoryRepository.saveAll(List.of(
                inventory("iphone_15_pro_max", 12),
                inventory("iphone_15", 30),
                inventory("macbook_pro_m3", 8),
                inventory("macbook_air_m2", 15),
                inventory("ipad_pro_m2", 20),
                inventory("airpods_pro_2", 40),
                inventory("samsung_s24_ultra", 18),
                inventory("sony_wh1000xm5", 25)));
    }

    private Inventory inventory(String skuCode, int quantity) {
        Inventory inventory = new Inventory();
        inventory.setSkuCode(skuCode);
        inventory.setQuantity(quantity);
        return inventory;
    }
}
