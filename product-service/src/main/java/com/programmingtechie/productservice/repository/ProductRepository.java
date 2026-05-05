package com.programmingtechie.productservice.repository;

import com.programmingtechie.productservice.model.Product;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findBySkuCode(String skuCode);
    boolean existsBySkuCode(String skuCode);
}
