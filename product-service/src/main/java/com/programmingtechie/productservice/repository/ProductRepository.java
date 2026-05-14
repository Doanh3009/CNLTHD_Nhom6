package com.programmingtechie.productservice.repository;

import com.programmingtechie.productservice.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByStatus(String status);
    Optional<Product> findBySkuCode(String skuCode);
}
