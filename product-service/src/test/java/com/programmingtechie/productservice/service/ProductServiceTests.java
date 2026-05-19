package com.programmingtechie.productservice.service;

import com.programmingtechie.productservice.dto.ProductRequest;
import com.programmingtechie.productservice.model.Product;
import com.programmingtechie.productservice.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTests {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void createProductNormalizesSkuAndAppliesDefaults() {
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProductRequest request = ProductRequest.builder()
                .name("Dell XPS 15 OLED")
                .description("Laptop")
                .price(BigDecimal.valueOf(49_990_000))
                .build();

        var response = productService.createProduct(request);

        assertEquals("dell_xps_15_oled", response.getSkuCode());
        assertEquals("piece", response.getUnit());
        assertEquals(0, response.getStockQuantity());
        assertEquals("VISIBLE", response.getStatus());
    }

    @Test
    void deleteProductWithImportHistoryHidesProductInsteadOfDeletingIt() {
        Product product = Product.builder()
                .id("p1")
                .name("Apple Watch")
                .status("VISIBLE")
                .hasImportHistory(true)
                .build();
        when(productRepository.findById("p1")).thenReturn(Optional.of(product));

        productService.deleteProduct("p1");

        ArgumentCaptor<Product> captor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(captor.capture());
        verify(productRepository, never()).delete(any(Product.class));
        assertEquals("HIDDEN", captor.getValue().getStatus());
        assertFalse(Boolean.FALSE.equals(captor.getValue().getHasImportHistory()));
    }
}
