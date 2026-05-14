// Reset the KDKTech demo catalog in MongoDB.
// Run from the repository root:
// docker exec -i mongo mongosh < insert_products.js

db = db.getSiblingDB("product-service");

db.category.deleteMany({});
db.product.deleteMany({});

db.category.insertMany([
  {
    code: "smart-watches",
    name: "Smart Watches",
    description: "Wearables for fitness, notifications, and everyday health tracking.",
    imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1000&auto=format&fit=crop",
    status: "VISIBLE",
    displayOrder: 1
  },
  {
    code: "headphones",
    name: "Headphones",
    description: "Wireless audio, gaming headsets, and noise-cancelling listening gear.",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop",
    status: "VISIBLE",
    displayOrder: 2
  },
  {
    code: "smart-phones",
    name: "Smart Phones",
    description: "Premium iOS and Android phones for camera, battery, and 5G.",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop",
    status: "VISIBLE",
    displayOrder: 3
  },
  {
    code: "laptops",
    name: "Laptops",
    description: "Portable computers for work, study, creators, and everyday use.",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&auto=format&fit=crop",
    status: "VISIBLE",
    displayOrder: 4
  },
  {
    code: "gaming-console",
    name: "Gaming Console",
    description: "Console and immersive gaming hardware for home entertainment.",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1000&auto=format&fit=crop",
    status: "VISIBLE",
    displayOrder: 5
  },
  {
    code: "tablets",
    name: "Tablets",
    description: "Lightweight tablets for entertainment, study, work, and sketching.",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&auto=format&fit=crop",
    status: "VISIBLE",
    displayOrder: 6
  }
]);

const products = [
  {
    skuCode: "chrome_watch",
    name: "Chrome Watch",
    description: "Polished smartwatch with AMOLED display, health tracking, and all-day battery life.",
    price: 9690000,
    category: "Smart Watches",
    imageUrl: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=1000&auto=format&fit=crop",
    stockQuantity: 32
  },
  {
    skuCode: "black_sports_watch",
    name: "Black Sports Watch",
    description: "Rugged fitness watch with GPS, swim tracking, sleep insights, and quick-charge battery.",
    price: 8990000,
    category: "Smart Watches",
    imageUrl: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1000&auto=format&fit=crop",
    stockQuantity: 26
  },
  {
    skuCode: "apple_watch_ultra_2",
    name: "Apple Watch Ultra 2",
    description: "Titanium smartwatch with precision GPS, bright display, and endurance sports features.",
    price: 21990000,
    category: "Smart Watches",
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1000&auto=format&fit=crop",
    stockQuantity: 18
  },
  {
    skuCode: "playstation_headset",
    name: "PlayStation Headset",
    description: "Wireless gaming headset with low-latency audio, plush earcups, and clear voice chat.",
    price: 5990000,
    category: "Headphones",
    imageUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1000&auto=format&fit=crop",
    stockQuantity: 24
  },
  {
    skuCode: "sony_wh1000xm5",
    name: "Sony WH-1000XM5",
    description: "Flagship noise cancelling headphones with 30-hour battery and multipoint connection.",
    price: 8990000,
    category: "Headphones",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop",
    stockQuantity: 36
  },
  {
    skuCode: "airpods_max",
    name: "AirPods Max",
    description: "Over-ear Apple headphones with spatial audio, active noise cancellation, and premium build.",
    price: 12990000,
    category: "Headphones",
    imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=1000&auto=format&fit=crop",
    stockQuantity: 20
  },
  {
    skuCode: "iphone_14_pro",
    name: "iPhone 14 Pro",
    description: "A16 chip, Dynamic Island, 48MP camera, and Always-On Super Retina display.",
    price: 19990000,
    category: "Smart Phones",
    imageUrl: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=1000&auto=format&fit=crop",
    stockQuantity: 28
  },
  {
    skuCode: "android_phone_premium_set",
    name: "Android Phone Premium Set",
    description: "Premium Android bundle with high-refresh display, AI camera tools, and fast charging.",
    price: 14990000,
    category: "Smart Phones",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1000&auto=format&fit=crop",
    stockQuantity: 34
  },
  {
    skuCode: "samsung_s24_ultra",
    name: "Samsung Galaxy S24 Ultra",
    description: "Galaxy AI phone with integrated S Pen, 200MP camera, and Dynamic AMOLED display.",
    price: 31990000,
    category: "Smart Phones",
    imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1000&auto=format&fit=crop",
    stockQuantity: 22
  },
  {
    skuCode: "silver_laptop_pro",
    name: "Silver Laptop Pro",
    description: "Slim aluminum laptop with bright display, fast SSD, and reliable performance for work.",
    price: 27990000,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1000&auto=format&fit=crop",
    stockQuantity: 16
  },
  {
    skuCode: "macbook_air_15",
    name: "MacBook Air 15",
    description: "Large Liquid Retina display, silent Apple silicon performance, and long battery life.",
    price: 32990000,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&auto=format&fit=crop",
    stockQuantity: 14
  },
  {
    skuCode: "dell_xps_15_oled",
    name: "Dell XPS 15 OLED",
    description: "Creator laptop with OLED display, dedicated graphics, and premium machined chassis.",
    price: 49990000,
    category: "Laptops",
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1000&auto=format&fit=crop",
    stockQuantity: 10
  },
  {
    skuCode: "playstation_5",
    name: "PlayStation 5",
    description: "Next-gen console with ultra-fast SSD, DualSense controller, and 4K gaming support.",
    price: 13990000,
    category: "Gaming Console",
    imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1000&auto=format&fit=crop",
    stockQuantity: 15
  },
  {
    skuCode: "xbox_series_x",
    name: "Xbox Series X",
    description: "Powerful console with fast load times, 4K gameplay, and a huge Game Pass library.",
    price: 12990000,
    category: "Gaming Console",
    imageUrl: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=1000&auto=format&fit=crop",
    stockQuantity: 12
  },
  {
    skuCode: "vr_gaming_headset",
    name: "VR Gaming Headset",
    description: "Immersive VR headset for games, virtual events, and interactive entertainment.",
    price: 16990000,
    category: "Gaming Console",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1000&auto=format&fit=crop",
    stockQuantity: 19
  },
  {
    skuCode: "tablet_x5",
    name: "Tablet X5",
    description: "Portable tablet with vivid display, stylus support, and reliable battery for travel.",
    price: 15990000,
    category: "Tablets",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&auto=format&fit=crop",
    stockQuantity: 27
  },
  {
    skuCode: "ipad_air",
    name: "iPad Air",
    description: "Light tablet with Apple silicon, vivid display, Touch ID, and Apple Pencil support.",
    price: 19990000,
    category: "Tablets",
    imageUrl: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=1000&auto=format&fit=crop",
    stockQuantity: 21
  },
  {
    skuCode: "galaxy_tab_s9",
    name: "Galaxy Tab S9",
    description: "Premium Android tablet with AMOLED screen, S Pen, and water-resistant design.",
    price: 22990000,
    category: "Tablets",
    imageUrl: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=1000&auto=format&fit=crop",
    stockQuantity: 17
  }
];

db.product.insertMany(products.map((product) => ({
  ...product,
  unit: "piece",
  lastImportPrice: Math.round(product.price * 0.8),
  profitMarginPercent: 25,
  status: "VISIBLE",
  hasImportHistory: false
})));

print("KDKTech catalog reset complete.");
print("Total categories: " + db.category.count());
print("Total products: " + db.product.count());
