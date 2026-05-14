package com.programmingtechie.productservice.service;

import com.programmingtechie.productservice.dto.CategoryRequest;
import com.programmingtechie.productservice.dto.CategoryResponse;
import com.programmingtechie.productservice.model.Category;
import com.programmingtechie.productservice.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private static final String VISIBLE = "VISIBLE";

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getCategories(boolean includeHidden) {
        List<Category> categories = includeHidden
                ? categoryRepository.findAllByOrderByDisplayOrderAsc()
                : categoryRepository.findByStatusOrderByDisplayOrderAsc(VISIBLE);
        return categories.stream().map(this::mapToResponse).toList();
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        categoryRepository.findByCode(normalizeCode(request.getCode(), request.getName()))
                .ifPresent(category -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category code already exists");
                });
        Category category = Category.builder()
                .code(normalizeCode(request.getCode(), request.getName()))
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .status(normalizeStatus(request.getStatus()))
                .displayOrder(request.getDisplayOrder() == null ? 0 : request.getDisplayOrder())
                .build();
        return mapToResponse(categoryRepository.save(category));
    }

    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        Category category = findCategory(id);
        category.setCode(normalizeCode(request.getCode(), request.getName()));
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        category.setStatus(normalizeStatus(request.getStatus()));
        category.setDisplayOrder(request.getDisplayOrder() == null ? 0 : request.getDisplayOrder());
        return mapToResponse(categoryRepository.save(category));
    }

    public void deleteCategory(String id) {
        categoryRepository.delete(findCategory(id));
    }

    private Category findCategory(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .code(category.getCode())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .status(category.getStatus())
                .displayOrder(category.getDisplayOrder())
                .build();
    }

    private String normalizeCode(String code, String name) {
        String value = code == null || code.isBlank() ? name : code;
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category code is required");
        }
        return value.trim().toLowerCase().replaceAll("[^a-z0-9]+", "_").replaceAll("^_+|_+$", "");
    }

    private String normalizeStatus(String status) {
        return "HIDDEN".equalsIgnoreCase(status) ? "HIDDEN" : VISIBLE;
    }
}

