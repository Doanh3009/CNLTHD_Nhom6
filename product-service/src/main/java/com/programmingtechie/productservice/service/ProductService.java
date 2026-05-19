package com.programmingtechie.productservice.service;

import com.programmingtechie.productservice.dto.ProductImportSyncRequest;
import com.programmingtechie.productservice.dto.ProductRequest;
import com.programmingtechie.productservice.dto.ProductResponse;
import com.programmingtechie.productservice.model.Product;
import com.programmingtechie.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private static final String VISIBLE = "VISIBLE";
    private static final String HIDDEN = "HIDDEN";

    private final ProductRepository productRepository;

    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .skuCode(normalizeSku(productRequest.getSkuCode(), productRequest.getName()))
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(defaultMoney(productRequest.getPrice()))
                .category(productRequest.getCategory())
                .imageUrl(productRequest.getImageUrl())
                .stockQuantity(defaultInteger(productRequest.getStockQuantity()))
                .unit(defaultUnit(productRequest.getUnit()))
                .lastImportPrice(defaultMoney(productRequest.getLastImportPrice()))
                .profitMarginPercent(defaultMoney(productRequest.getProfitMarginPercent()))
                .status(normalizeStatus(productRequest.getStatus()))
                .hasImportHistory(false)
                .build();

        Product saved = productRepository.save(product);
        log.info("Product {} is saved", saved.getId());
        return mapToProductResponse(saved);
    }

    public List<ProductResponse> getVisibleProducts() {
        return productRepository.findAll().stream()
                .filter(product -> !HIDDEN.equalsIgnoreCase(product.getStatus()))
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<ProductResponse> getAdminProducts() {
        return productRepository.findAll().stream().map(this::mapToProductResponse).toList();
    }

    public ProductResponse getProduct(String id) {
        return mapToProductResponse(findProduct(id));
    }

    public ProductResponse updateProduct(String id, ProductRequest productRequest) {
        Product product = findProduct(id);
        product.setSkuCode(normalizeSku(productRequest.getSkuCode(), productRequest.getName()));
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setCategory(productRequest.getCategory());
        product.setImageUrl(productRequest.getImageUrl());
        product.setStockQuantity(defaultInteger(productRequest.getStockQuantity()));
        product.setUnit(defaultUnit(productRequest.getUnit()));
        product.setLastImportPrice(defaultMoney(productRequest.getLastImportPrice()));
        product.setProfitMarginPercent(defaultMoney(productRequest.getProfitMarginPercent()));
        product.setPrice(defaultMoney(productRequest.getPrice()));
        product.setStatus(normalizeStatus(productRequest.getStatus()));
        if (product.getHasImportHistory() == null) {
            product.setHasImportHistory(false);
        }
        return mapToProductResponse(productRepository.save(product));
    }

    public void deleteProduct(String id) {
        Product product = findProduct(id);
        if (Boolean.TRUE.equals(product.getHasImportHistory())) {
            product.setStatus(HIDDEN);
            productRepository.save(product);
            return;
        }
        productRepository.delete(product);
    }

    public ProductResponse syncImport(ProductImportSyncRequest request) {
        Product product = productRepository.findBySkuCode(request.getSkuCode())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        product.setHasImportHistory(true);
        product.setLastImportPrice(defaultMoney(request.getLastImportPrice()));
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }
        return mapToProductResponse(productRepository.save(product));
    }

    private ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .skuCode(product.getSkuCode())
                .name(product.getName())
                .description(product.getDescription())
                .price(defaultMoney(product.getPrice()))
                .category(product.getCategory())
                .imageUrl(product.getImageUrl())
                .stockQuantity(defaultInteger(product.getStockQuantity()))
                .unit(defaultUnit(product.getUnit()))
                .lastImportPrice(defaultMoney(product.getLastImportPrice()))
                .profitMarginPercent(defaultMoney(product.getProfitMarginPercent()))
                .status(product.getStatus() == null ? VISIBLE : product.getStatus())
                .hasImportHistory(Boolean.TRUE.equals(product.getHasImportHistory()))
                .build();
    }

    private Product findProduct(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    private String normalizeSku(String skuCode, String name) {
        if (skuCode != null && !skuCode.isBlank()) {
            return skuCode.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", "_");
        }
        if (name == null || name.isBlank()) {
            return null;
        }
        return name.trim().toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "_")
                .replaceAll("^_+|_+$", "");
    }

    private String normalizeStatus(String status) {
        return HIDDEN.equalsIgnoreCase(status) ? HIDDEN : VISIBLE;
    }

    private String defaultUnit(String unit) {
        return unit == null || unit.isBlank() ? "piece" : unit;
    }

    private Integer defaultInteger(Integer value) {
        return value == null ? 0 : value;
    }

    private BigDecimal defaultMoney(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

}
