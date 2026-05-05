package com.programmingtechie.productservice.service;

import com.programmingtechie.productservice.dto.ProductRequest;
import com.programmingtechie.productservice.dto.ProductResponse;
import com.programmingtechie.productservice.model.Product;
import com.programmingtechie.productservice.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        validateProduct(productRequest);
        String skuCode = normalizeSku(productRequest.getSkuCode());
        if (productRepository.existsBySkuCode(skuCode)) {
            throw new IllegalArgumentException("SKU already exists: " + skuCode);
        }

        Product product = Product.builder()
                .skuCode(skuCode)
                .name(productRequest.getName().trim())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .category(productRequest.getCategory())
                .brand(productRequest.getBrand())
                .imageUrl(productRequest.getImageUrl())
                .specifications(productRequest.getSpecifications())
                .active(productRequest.getActive() == null || productRequest.getActive())
                .build();

        Product saved = productRepository.save(product);
        log.info("Product {} is saved", saved.getId());
        return mapToProductResponse(saved);
    }

    public List<ProductResponse> getAllProducts(String search, String category, String brand) {
        return productRepository.findAll().stream()
                .filter(Product::isActive)
                .filter(product -> matches(search, product.getName(), product.getDescription(), product.getSkuCode()))
                .filter(product -> category == null || category.isBlank()
                        || category.equalsIgnoreCase(product.getCategory()))
                .filter(product -> brand == null || brand.isBlank()
                        || brand.equalsIgnoreCase(product.getBrand()))
                .map(this::mapToProductResponse)
                .toList();
    }

    public ProductResponse getProduct(String id) {
        return productRepository.findById(id)
                .map(this::mapToProductResponse)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
    }

    public ProductResponse getProductBySku(String skuCode) {
        return productRepository.findBySkuCode(normalizeSku(skuCode))
                .map(this::mapToProductResponse)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + skuCode));
    }

    public ProductResponse updateProduct(String id, ProductRequest productRequest) {
        validateProduct(productRequest);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        String skuCode = normalizeSku(productRequest.getSkuCode());
        if (!skuCode.equals(product.getSkuCode()) && productRepository.existsBySkuCode(skuCode)) {
            throw new IllegalArgumentException("SKU already exists: " + skuCode);
        }

        product.setSkuCode(skuCode);
        product.setName(productRequest.getName().trim());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setCategory(productRequest.getCategory());
        product.setBrand(productRequest.getBrand());
        product.setImageUrl(productRequest.getImageUrl());
        product.setSpecifications(productRequest.getSpecifications());
        product.setActive(productRequest.getActive() == null || productRequest.getActive());
        return mapToProductResponse(productRepository.save(product));
    }

    public void deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        product.setActive(false);
        productRepository.save(product);
    }

    private void validateProduct(ProductRequest productRequest) {
        if (productRequest == null
                || isBlank(productRequest.getSkuCode())
                || isBlank(productRequest.getName())
                || productRequest.getPrice() == null
                || productRequest.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("SKU, name and positive price are required");
        }
    }

    private boolean matches(String search, String... values) {
        if (search == null || search.isBlank()) {
            return true;
        }
        String normalizedSearch = search.toLowerCase(Locale.ROOT);
        for (String value : values) {
            if (value != null && value.toLowerCase(Locale.ROOT).contains(normalizedSearch)) {
                return true;
            }
        }
        return false;
    }

    private String normalizeSku(String skuCode) {
        return skuCode.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]", "_");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .skuCode(product.getSkuCode())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .brand(product.getBrand())
                .imageUrl(product.getImageUrl())
                .specifications(product.getSpecifications())
                .active(product.isActive())
                .build();
    }
}
