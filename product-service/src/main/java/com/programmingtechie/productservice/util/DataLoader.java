package com.programmingtechie.productservice.util;

import com.programmingtechie.productservice.model.Product;
import com.programmingtechie.productservice.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.saveAll(List.of(
                product("iphone_15_pro_max", "iPhone 15 Pro Max", "Apple", "iPhone",
                        "Chip A17 Pro, titanium design, camera 48MP", 34990000,
                        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop",
                        Map.of("chip", "A17 Pro", "display", "6.7 inch Super Retina XDR", "storage", "256GB")),
                product("iphone_15", "iPhone 15", "Apple", "iPhone",
                        "Dynamic Island, camera 48MP, USB-C", 22990000,
                        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop",
                        Map.of("chip", "A16 Bionic", "display", "6.1 inch", "storage", "128GB")),
                product("macbook_pro_m3", "MacBook Pro 14 M3", "Apple", "Mac",
                        "Liquid Retina XDR, Thunderbolt 4, pin 18 gio", 54990000,
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
                        Map.of("chip", "M3 Pro", "ram", "18GB", "storage", "512GB SSD")),
                product("macbook_air_m2", "MacBook Air 13 M2", "Apple", "Mac",
                        "Thiet ke mong nhe, chip M2, khong quat tan nhiet", 29990000,
                        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop",
                        Map.of("chip", "M2", "ram", "8GB", "storage", "256GB SSD")),
                product("ipad_pro_m2", "iPad Pro 12.9 M2", "Apple", "iPad",
                        "Liquid Retina XDR, ho tro Apple Pencil", 27990000,
                        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop",
                        Map.of("chip", "M2", "display", "12.9 inch", "storage", "128GB")),
                product("airpods_pro_2", "AirPods Pro 2", "Apple", "Audio",
                        "Chong on chu dong, Spatial Audio, chip H2", 6990000,
                        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop",
                        Map.of("battery", "30 gio voi hop sac", "feature", "ANC")),
                product("samsung_s24_ultra", "Samsung Galaxy S24 Ultra", "Samsung", "Android",
                        "S Pen, camera 200MP, Galaxy AI", 31990000,
                        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop",
                        Map.of("display", "6.8 inch AMOLED", "camera", "200MP", "storage", "256GB")),
                product("sony_wh1000xm5", "Sony WH-1000XM5", "Sony", "Audio",
                        "Tai nghe chong on, pin 30 gio, Hi-Res Audio", 8990000,
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
                        Map.of("battery", "30 gio", "feature", "ANC"))));
    }

    private Product product(String skuCode, String name, String brand, String category, String description,
            int price, String imageUrl, Map<String, String> specifications) {
        return Product.builder()
                .skuCode(skuCode)
                .name(name)
                .brand(brand)
                .category(category)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .imageUrl(imageUrl)
                .specifications(specifications)
                .active(true)
                .build();
    }
}
