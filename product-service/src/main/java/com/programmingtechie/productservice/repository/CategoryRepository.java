package com.programmingtechie.productservice.repository;

import com.programmingtechie.productservice.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByStatusOrderByDisplayOrderAsc(String status);
    List<Category> findAllByOrderByDisplayOrderAsc();
    Optional<Category> findByCode(String code);
}

