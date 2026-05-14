package com.techshop.chatbotservice;

import com.techshop.chatbotservice.dto.ChatResponse;
import com.techshop.chatbotservice.dto.ProductRecommendation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ChatbotService {

    private static final int RECOMMENDATION_LIMIT = 3;
    private static final Pattern BUDGET_PATTERN = Pattern.compile("(?:under|below|less than|max|maximum|budget|duoi|toi da|khoang|tam)\\s*([0-9][0-9.,]*)\\s*(m|million|trieu|k|000|vnd)?");
    private static final Pattern NUMBER_PATTERN = Pattern.compile("([0-9][0-9.,]*)\\s*(m|million|trieu|k|000|vnd)");

    private static final Map<String, String> CATEGORY_ALIASES = Map.of(
            "Tat ca", "All",
            "Phu kien", "Accessories",
            "Khac", "Other"
    );

    private static final Map<String, String> PRODUCT_CATEGORY_BY_SKU = Map.ofEntries(
            Map.entry("iphone_13", "iPhone"),
            Map.entry("iphone_15_pro_max", "iPhone"),
            Map.entry("iphone_15", "iPhone"),
            Map.entry("iphone_14_pro", "iPhone"),
            Map.entry("macbook_pro_m3", "Mac"),
            Map.entry("macbook_air_m2", "Mac"),
            Map.entry("ipad_pro_m2", "iPad"),
            Map.entry("ipad_air_m1", "iPad"),
            Map.entry("apple_watch_s9", "Watch"),
            Map.entry("apple_watch_ultra_2", "Watch"),
            Map.entry("airpods_pro_2", "Audio"),
            Map.entry("sony_wh1000xm5", "Audio"),
            Map.entry("samsung_s24_ultra", "Android"),
            Map.entry("pixel_8_pro", "Android"),
            Map.entry("samsung_z_fold5", "Android"),
            Map.entry("dell_xps_15", "Mac")
    );

    private static final Map<String, String> PRODUCT_DESCRIPTION_BY_SKU = Map.ofEntries(
            Map.entry("iphone_13", "A15 Bionic performance, dual-camera system, and dependable everyday battery life."),
            Map.entry("iphone_15_pro_max", "A17 Pro chip, titanium design, 48MP camera, and a 6.7-inch Super Retina XDR 120Hz display."),
            Map.entry("iphone_15", "A16 Bionic chip, Dynamic Island, 48MP camera, and convenient USB-C charging."),
            Map.entry("iphone_14_pro", "A16 chip, Dynamic Island, 48MP camera, and Always-On display."),
            Map.entry("macbook_pro_m3", "M3 Pro chip, Liquid Retina XDR display, 18-hour battery life, and Thunderbolt 4 connectivity."),
            Map.entry("macbook_air_m2", "Ultra-thin design, M2 chip, 13.6-inch Liquid Retina display, and a fanless body."),
            Map.entry("ipad_pro_m2", "Powerful M2 chip, 12.9-inch Liquid Retina XDR display, and Apple Pencil 2 support."),
            Map.entry("ipad_air_m1", "M1 chip, 10.9-inch Liquid Retina display, Touch ID, and 5G support."),
            Map.entry("apple_watch_s9", "Always-On Retina display, S9 chip, advanced health tracking, and fast charging."),
            Map.entry("apple_watch_ultra_2", "Titanium case, precision GPS, long battery life, and a build made for demanding sports."),
            Map.entry("airpods_pro_2", "Second-generation ANC, Spatial Audio, H2 chip, and up to 30 hours with the charging case."),
            Map.entry("sony_wh1000xm5", "Flagship noise cancellation, 30-hour battery life, multipoint connection, and Hi-Res Audio."),
            Map.entry("samsung_s24_ultra", "Integrated S Pen, 200MP camera, Galaxy AI, and a 6.8-inch Dynamic AMOLED 120Hz display."),
            Map.entry("pixel_8_pro", "Advanced AI camera, Tensor G3, 7 years of Android updates, and an LTPO OLED display."),
            Map.entry("samsung_z_fold5", "7.6-inch foldable display, slimmer design, S Pen support, and premium multitasking."),
            Map.entry("dell_xps_15", "15.6-inch 3.5K OLED display, 13th-gen Intel Core i7, RTX 4060, and premium build quality.")
    );

    private final WebClient webClient;

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model.name:llama-3.3-70b-versatile}")
    private String modelName;

    @Value("${product.service.url:http://localhost:8181/api/product}")
    private String productServiceUrl;

    public ChatbotService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public ChatResponse askQuestion(String question) {
        String cleanQuestion = Optional.ofNullable(question).orElse("").trim();
        List<ProductRecommendation> catalog = loadCatalog();
        List<ProductRecommendation> recommendations = recommendProducts(cleanQuestion, catalog);

        String fallbackReply = buildCatalogReply(cleanQuestion, recommendations, catalog.isEmpty());
        String aiReply = askGroq(cleanQuestion, recommendations, fallbackReply);

        return new ChatResponse(aiReply, recommendations);
    }

    private List<ProductRecommendation> loadCatalog() {
        try {
            List<ProductRecommendation> products = webClient.get()
                    .uri(productServiceUrl)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<ProductRecommendation>>() {
                    })
                    .block();

            if (products == null) {
                return List.of();
            }

            return products.stream()
                    .filter(Objects::nonNull)
                    .map(this::normalizeProduct)
                    .collect(Collectors.toList());
        } catch (Exception ignored) {
            return List.of();
        }
    }

    private ProductRecommendation normalizeProduct(ProductRecommendation product) {
        String sku = safe(product.getSkuCode());
        if (sku.isBlank()) {
            sku = makeSku(product.getName());
        }

        String category = safe(product.getCategory());
        String description = PRODUCT_DESCRIPTION_BY_SKU.getOrDefault(sku, safe(product.getDescription()));

        product.setSkuCode(sku);
        product.setCategory(CATEGORY_ALIASES.getOrDefault(category, category.isBlank() ? PRODUCT_CATEGORY_BY_SKU.getOrDefault(sku, "Other") : category));
        product.setDescription(description.isBlank() ? "Product details are being updated." : description);
        product.setStockQuantity(product.getStockQuantity() == null ? 99 : product.getStockQuantity());
        product.setPrice(product.getPrice() == null ? BigDecimal.ZERO : product.getPrice());
        return product;
    }

    private List<ProductRecommendation> recommendProducts(String question, List<ProductRecommendation> catalog) {
        if (catalog.isEmpty()) {
            return List.of();
        }

        String normalizedQuestion = normalize(question);
        Optional<BigDecimal> budget = extractBudget(normalizedQuestion);

        List<ProductRecommendation> scoredProducts = catalog.stream()
                .map(product -> scoreProduct(product, normalizedQuestion, budget))
                .filter(product -> product.getScore() > 0)
                .collect(Collectors.toCollection(ArrayList::new));

        List<ProductRecommendation> candidates = filterByIntent(normalizedQuestion, scoredProducts);
        if (budget.isPresent() && scoredProducts.stream().anyMatch(product -> product.getPrice().compareTo(budget.get()) <= 0)) {
            List<ProductRecommendation> budgetCandidates = candidates.stream()
                    .filter(product -> product.getPrice().compareTo(budget.get()) <= 0)
                    .collect(Collectors.toCollection(ArrayList::new));
            if (!budgetCandidates.isEmpty()) {
                candidates = budgetCandidates;
            }
        }

        List<ProductRecommendation> scored = candidates.stream()
                .sorted(Comparator.comparingInt(ProductRecommendation::getScore).reversed()
                        .thenComparing(ProductRecommendation::getPrice))
                .limit(RECOMMENDATION_LIMIT)
                .collect(Collectors.toCollection(ArrayList::new));

        if (scored.isEmpty()) {
            scored = catalog.stream()
                    .sorted(Comparator.comparing(ProductRecommendation::getPrice).reversed())
                    .limit(RECOMMENDATION_LIMIT)
                    .map(product -> withReason(product, "Popular option from the current catalog."))
                    .collect(Collectors.toCollection(ArrayList::new));
        }

        return scored;
    }

    private List<ProductRecommendation> filterByIntent(String question, List<ProductRecommendation> products) {
        List<ProductRecommendation> filtered = products;

        if (matches(question, "camera", "photo", "video", "photography", "chup anh", "quay phim")) {
            filtered = filterProducts(products, "iphone", "android", "pixel", "samsung", "galaxy");
        } else if (matches(question, "audio", "headphone", "headphones", "earbuds", "airpods", "sony", "music", "noise", "anc", "chong on", "am thanh")) {
            filtered = filterProducts(products, "audio", "airpods", "sony", "headphone");
        } else if (matches(question, "laptop", "macbook", "work", "office", "coding", "developer", "student", "hoc tap", "van phong")) {
            filtered = filterProducts(products, "mac", "macbook", "dell", "xps");
        } else if (matches(question, "tablet", "ipad", "drawing", "pencil", "note taking", "ghi chu", "ve")) {
            filtered = filterProducts(products, "ipad");
        } else if (matches(question, "watch", "fitness", "health", "sport", "running", "the thao", "suc khoe")) {
            filtered = filterProducts(products, "watch");
        } else if (matches(question, "iphone", "ios", "apple phone")) {
            filtered = filterProducts(products, "iphone");
        } else if (matches(question, "android", "samsung", "pixel", "galaxy")) {
            filtered = filterProducts(products, "android", "samsung", "pixel", "galaxy");
        }

        return filtered.isEmpty() ? products : filtered;
    }

    private List<ProductRecommendation> filterProducts(List<ProductRecommendation> products, String... keywords) {
        return products.stream()
                .filter(product -> {
                    String text = normalize(product.getCategory()) + " " + normalize(product.getName()) + " " + normalize(product.getDescription());
                    for (String keyword : keywords) {
                        if (text.contains(normalize(keyword))) {
                            return true;
                        }
                    }
                    return false;
                })
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private ProductRecommendation scoreProduct(ProductRecommendation product, String question, Optional<BigDecimal> budget) {
        int score = 0;
        Set<String> reasons = new LinkedHashSet<>();

        String name = normalize(product.getName());
        String category = normalize(product.getCategory());
        String description = normalize(product.getDescription());
        String sku = normalize(product.getSkuCode());
        String searchText = String.join(" ", name, category, description, sku);

        for (String token : question.split("\\s+")) {
            if (token.length() > 2 && searchText.contains(token)) {
                score += 4;
            }
        }

        if (matches(question, "iphone", "ios", "apple phone")) {
            score += scoreCategory(category, name, "iphone");
            addIfMatches(reasons, category, name, "iPhone request", "iphone");
        }
        if (matches(question, "android", "samsung", "pixel", "galaxy")) {
            score += scoreCategory(category, name, "android", "samsung", "pixel", "galaxy");
            addIfMatches(reasons, category, name, "Android request", "android", "samsung", "pixel", "galaxy");
        }
        if (matches(question, "laptop", "macbook", "work", "office", "coding", "developer", "student", "hoc tap", "van phong")) {
            score += scoreCategory(category, name, "mac", "macbook", "dell", "xps");
            addIfMatches(reasons, category, name, "Good fit for work or study", "mac", "macbook", "dell", "xps");
        }
        if (matches(question, "tablet", "ipad", "drawing", "pencil", "note taking", "ghi chu", "ve")) {
            score += scoreCategory(category, name, "ipad");
            addIfMatches(reasons, category, name, "Best match for tablet and pencil use", "ipad");
        }
        if (matches(question, "watch", "fitness", "health", "sport", "running", "the thao", "suc khoe")) {
            score += scoreCategory(category, name, "watch", "ultra");
            addIfMatches(reasons, category, name, "Useful for fitness and health tracking", "watch", "ultra");
        }
        if (matches(question, "audio", "headphone", "headphones", "earbuds", "airpods", "sony", "music", "noise", "anc", "chong on", "am thanh")) {
            score += scoreCategory(category, name, "audio", "airpods", "sony");
            addIfMatches(reasons, category, name, "Strong audio and noise cancellation match", "audio", "airpods", "sony");
        }
        if (matches(question, "camera", "photo", "video", "photography", "chup anh", "quay phim")) {
            score += scoreCategory(category, name, "iphone", "android", "pixel", "samsung", "galaxy");
            addIfMatches(reasons, category, name, "Strong camera and video capability", "iphone", "android", "pixel", "samsung", "galaxy");
        }
        if (matches(question, "battery", "long battery", "pin lau", "pin trau")) {
            score += scoreCategory(description, name, "battery", "30 hour", "18 hour", "60 hour", "ultra", "max");
            addIfMatches(reasons, description, name, "Good battery-life match", "battery", "30 hour", "18 hour", "60 hour", "ultra", "max");
        }
        if (matches(question, "premium", "best", "pro", "ultra", "flagship", "cao cap", "tot nhat")) {
            score += scoreCategory(name, description, "pro", "ultra", "max", "xdr", "flagship");
            addIfMatches(reasons, name, description, "Premium configuration", "pro", "ultra", "max", "xdr", "flagship");
        }
        if (matches(question, "cheap", "budget", "affordable", "low price", "gia re", "re", "sinh vien")) {
            score += product.getPrice().compareTo(BigDecimal.valueOf(25_000_000L)) <= 0 ? 7 : -3;
            if (product.getPrice().compareTo(BigDecimal.valueOf(25_000_000L)) <= 0) {
                reasons.add("Budget-friendly option");
            }
        }

        if (budget.isPresent()) {
            if (product.getPrice().compareTo(budget.get()) <= 0) {
                score += 10;
                reasons.add("Within the requested budget");
            } else {
                score -= 8;
            }
        }

        if (product.getStockQuantity() != null && product.getStockQuantity() > 0) {
            score += 1;
        }

        ProductRecommendation result = copyProduct(product);
        result.setScore(score);
        result.setReason(reasons.isEmpty() ? "Matches your product requirement." : String.join(", ", reasons) + ".");
        return result;
    }

    private String askGroq(String question, List<ProductRecommendation> recommendations, String fallbackReply) {
        if (safe(apiKey).isBlank() || recommendations.isEmpty()) {
            return fallbackReply;
        }

        try {
            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", """
                    You are TechShop AI, a concise sales assistant for an ecommerce site.
                    Answer in English.
                    Recommend only products listed in AVAILABLE_PRODUCT_CANDIDATES.
                    If the customer mentions a budget, respect it.
                    Include product names, prices in VND, and one practical reason.
                    Do not invent products, discounts, policies, or stock.
                    Keep the answer under 120 words.
                    """);

            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", "Customer request: " + question + "\n\nAVAILABLE_PRODUCT_CANDIDATES:\n" + catalogSummary(recommendations));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", modelName);
            requestBody.put("messages", List.of(systemMessage, userMessage));
            requestBody.put("temperature", 0.3);

            Map response = webClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> firstChoice = choices.get(0);
                    Map<String, Object> resMessage = (Map<String, Object>) firstChoice.get("message");
                    Object content = resMessage == null ? null : resMessage.get("content");
                    if (content != null && !content.toString().isBlank()) {
                        return content.toString();
                    }
                }
            }
        } catch (Exception ignored) {
            return fallbackReply;
        }

        return fallbackReply;
    }

    private String buildCatalogReply(String question, List<ProductRecommendation> recommendations, boolean catalogUnavailable) {
        if (catalogUnavailable) {
            return "I cannot load the product catalog right now. Please try again in a moment.";
        }

        if (recommendations.isEmpty()) {
            return "I could not find a strong match yet. Tell me your budget, preferred brand, and what matters most: camera, battery, work, gaming, tablet, watch, or audio.";
        }

        String intro = question.isBlank()
                ? "Here are good products from the current catalog:"
                : "Based on your request, I recommend:";

        return intro + "\n" + recommendations.stream()
                .map(product -> String.format("- %s: %s. %s", product.getName(), money(product.getPrice()), product.getReason()))
                .collect(Collectors.joining("\n"));
    }

    private String catalogSummary(List<ProductRecommendation> recommendations) {
        return recommendations.stream()
                .map(product -> String.format("%s | %s | %s | %s | stock %s | reason: %s",
                        product.getName(),
                        product.getCategory(),
                        money(product.getPrice()),
                        product.getDescription(),
                        product.getStockQuantity(),
                        product.getReason()))
                .collect(Collectors.joining("\n"));
    }

    private Optional<BigDecimal> extractBudget(String question) {
        Matcher budgetMatcher = BUDGET_PATTERN.matcher(question);
        if (budgetMatcher.find()) {
            return parseBudget(budgetMatcher.group(1), budgetMatcher.group(2));
        }

        Matcher numberMatcher = NUMBER_PATTERN.matcher(question);
        if (numberMatcher.find()) {
            return parseBudget(numberMatcher.group(1), numberMatcher.group(2));
        }

        return Optional.empty();
    }

    private Optional<BigDecimal> parseBudget(String numberText, String unitText) {
        try {
            String unit = safe(unitText);
            if (unit.equals("m") || unit.equals("million") || unit.equals("trieu")) {
                BigDecimal value = new BigDecimal(numberText.replace(",", "."));
                return Optional.of(value.multiply(BigDecimal.valueOf(1_000_000L)));
            }
            if (unit.equals("k")) {
                BigDecimal value = new BigDecimal(numberText.replace(",", "."));
                return Optional.of(value.multiply(BigDecimal.valueOf(1_000L)));
            }
            BigDecimal value = new BigDecimal(numberText.replace(".", "").replace(",", ""));
            return Optional.of(value);
        } catch (NumberFormatException ignored) {
            return Optional.empty();
        }
    }

    private ProductRecommendation withReason(ProductRecommendation product, String reason) {
        ProductRecommendation copy = copyProduct(product);
        copy.setReason(reason);
        copy.setScore(1);
        return copy;
    }

    private ProductRecommendation copyProduct(ProductRecommendation product) {
        return ProductRecommendation.builder()
                .id(product.getId())
                .skuCode(product.getSkuCode())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .stockQuantity(product.getStockQuantity())
                .reason(product.getReason())
                .score(product.getScore())
                .build();
    }

    private int scoreCategory(String primaryText, String secondaryText, String... keywords) {
        String text = primaryText + " " + secondaryText;
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return 12;
            }
        }
        return 0;
    }

    private void addIfMatches(Set<String> reasons, String primaryText, String secondaryText, String reason, String... keywords) {
        String text = primaryText + " " + secondaryText;
        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                reasons.add(reason);
                return;
            }
        }
    }

    private boolean matches(String text, String... keywords) {
        for (String keyword : keywords) {
            if (text.contains(normalize(keyword))) {
                return true;
            }
        }
        return false;
    }

    private String makeSku(String value) {
        return normalize(value).replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
    }

    private String normalize(String value) {
        String safeValue = safe(value).toLowerCase(Locale.ROOT);
        String normalized = Normalizer.normalize(safeValue, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }

    private String money(BigDecimal value) {
        return String.format(Locale.US, "%,.0f VND", value);
    }
}
