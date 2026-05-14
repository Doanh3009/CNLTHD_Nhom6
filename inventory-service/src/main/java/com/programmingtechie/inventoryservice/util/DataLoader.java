package com.programmingtechie.inventoryservice.util;

import com.programmingtechie.inventoryservice.model.Inventory;
import com.programmingtechie.inventoryservice.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final InventoryRepository inventoryRepository;

    @Override
    public void run(String... args) {
        List<Inventory> demoStock = List.of(
                inventory("chrome_watch", 32),
                inventory("black_sports_watch", 26),
                inventory("apple_watch_ultra_2", 18),
                inventory("playstation_headset", 24),
                inventory("sony_wh1000xm5", 36),
                inventory("airpods_max", 20),
                inventory("iphone_14_pro", 28),
                inventory("android_phone_premium_set", 34),
                inventory("samsung_s24_ultra", 22),
                inventory("silver_laptop_pro", 16),
                inventory("macbook_air_15", 14),
                inventory("dell_xps_15_oled", 10),
                inventory("playstation_5", 15),
                inventory("xbox_series_x", 12),
                inventory("vr_gaming_headset", 19),
                inventory("tablet_x5", 27),
                inventory("ipad_air", 21),
                inventory("galaxy_tab_s9", 17)
        );
        demoStock.forEach(item -> inventoryRepository.findBySkuCode(item.getSkuCode())
                .orElseGet(() -> inventoryRepository.save(item)));
    }

    private Inventory inventory(String skuCode, int quantity) {
        Inventory inventory = new Inventory();
        inventory.setSkuCode(skuCode);
        inventory.setQuantity(quantity);
        return inventory;
    }
}
