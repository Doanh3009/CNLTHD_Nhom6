package com.programmingtechie.productservice.util;

import com.programmingtechie.productservice.model.Category;
import com.programmingtechie.productservice.model.Product;
import com.programmingtechie.productservice.repository.CategoryRepository;
import com.programmingtechie.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() < 1) {
            categoryRepository.saveAll(defaultCategories());
        }
        if (productRepository.count() < 1) {
            productRepository.saveAll(defaultCatalog());
        }
    }

    private List<Category> defaultCategories() {
        return List.of(
                category("smart_watches", "Smart Watches", "Fitness tracking, bright displays, and premium straps.", "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1000&auto=format&fit=crop", 1),
                category("headphones", "Headphones", "Noise cancellation and immersive wireless audio.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop", 2),
                category("smart_phones", "Smart Phones", "Flagship cameras, fast chips, and 5G connectivity.", "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=1000&auto=format&fit=crop", 3),
                category("laptops", "Laptops", "Portable machines for study, work, and creation.", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop", 4),
                category("gaming_console", "Gaming Console", "Consoles, VR, and gaming audio for every setup.", "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1000&auto=format&fit=crop", 5),
                category("tablets", "Tablets", "Big-screen entertainment, notes, and productivity.", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&auto=format&fit=crop", 6)
        );
    }

    private List<Product> defaultCatalog() {
        return List.of(
                product("chrome_watch", "Chrome Watch", "Polished smartwatch with AMOLED display, health tracking, and all-day battery life.", 9690000, "Smart Watches", "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1000&auto=format&fit=crop", 32),
                product("black_sports_watch", "Black Sports Watch", "Rugged fitness watch with GPS, swim tracking, sleep insights, and quick-charge battery.", 8990000, "Smart Watches", "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1000&auto=format&fit=crop", 26),
                product("apple_watch_ultra_2", "Apple Watch Ultra 2", "Titanium smartwatch with precision GPS, bright display, and endurance sports features.", 21990000, "Smart Watches", "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&auto=format&fit=crop", 18),
                product("playstation_headset", "PlayStation Headset", "Wireless gaming headset with low-latency audio, plush earcups, and clear voice chat.", 5990000, "Headphones", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop", 24),
                product("sony_wh1000xm5", "Sony WH-1000XM5", "Flagship noise cancelling headphones with 30-hour battery and multipoint connection.", 8990000, "Headphones", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop", 36),
                product("airpods_max", "AirPods Max", "Over-ear Apple headphones with spatial audio, active noise cancellation, and premium build.", 12990000, "Headphones", "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1000&auto=format&fit=crop", 20),
                product("iphone_14_pro", "iPhone 14 Pro", "A16 chip, Dynamic Island, 48MP camera, and Always-On Super Retina display.", 19990000, "Smart Phones", "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=1000&auto=format&fit=crop", 28),
                product("android_phone_premium_set", "Android Phone Premium Set", "Premium Android bundle with high-refresh display, AI camera tools, and fast charging.", 14990000, "Smart Phones", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop", 34),
                product("samsung_s24_ultra", "Samsung Galaxy S24 Ultra", "Galaxy AI phone with integrated S Pen, 200MP camera, and Dynamic AMOLED display.", 31990000, "Smart Phones", "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000&auto=format&fit=crop", 22),
                product("silver_laptop_pro", "Silver Laptop Pro", "Slim aluminum laptop with bright display, fast SSD, and reliable performance for work.", 27990000, "Laptops", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&auto=format&fit=crop", 16),
                product("macbook_air_15", "MacBook Air 15", "Large Liquid Retina display, silent Apple silicon performance, and long battery life.", 32990000, "Laptops", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop", 14),
                product("dell_xps_15_oled", "Dell XPS 15 OLED", "Creator laptop with OLED display, dedicated graphics, and premium machined chassis.", 49990000, "Laptops", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&auto=format&fit=crop", 10),
                product("playstation_5", "PlayStation 5", "Next-gen console with ultra-fast SSD, DualSense controller, and 4K gaming support.", 13990000, "Gaming Console", "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1000&auto=format&fit=crop", 15),
                product("xbox_series_x", "Xbox Series X", "Powerful console with fast load times, 4K gameplay, and a huge Game Pass library.", 12990000, "Gaming Console", "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1000&auto=format&fit=crop", 12),
                product("vr_gaming_headset", "VR Gaming Headset", "Immersive VR headset for games, virtual events, and interactive entertainment.", 16990000, "Gaming Console", "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1000&auto=format&fit=crop", 19),
                product("tablet_x5", "Tablet X5", "Portable tablet with vivid display, stylus support, and reliable battery for travel.", 15990000, "Tablets", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&auto=format&fit=crop", 27),
                product("ipad_air", "iPad Air", "Light tablet with Apple silicon, vivid display, Touch ID, and Apple Pencil support.", 19990000, "Tablets", "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1000&auto=format&fit=crop", 21),
                product("galaxy_tab_s9", "Galaxy Tab S9", "Premium Android tablet with AMOLED screen, S Pen, and water-resistant design.", 22990000, "Tablets", "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=1000&auto=format&fit=crop", 17)
        );
    }

    private Product product(String skuCode, String name, String description, long price, String category, String imageUrl, int stockQuantity) {
        BigDecimal importPrice = BigDecimal.valueOf(Math.round(price * 0.8));
        return Product.builder()
                .skuCode(skuCode)
                .name(name)
                .description(description)
                .price(BigDecimal.valueOf(price))
                .category(category)
                .imageUrl(imageUrl)
                .stockQuantity(stockQuantity)
                .unit("piece")
                .lastImportPrice(importPrice)
                .profitMarginPercent(BigDecimal.valueOf(25))
                .status("VISIBLE")
                .hasImportHistory(false)
                .build();
    }

    private Category category(String code, String name, String description, String imageUrl, int displayOrder) {
        return Category.builder()
                .code(code)
                .name(name)
                .description(description)
                .imageUrl(imageUrl)
                .status("VISIBLE")
                .displayOrder(displayOrder)
                .build();
    }
}
