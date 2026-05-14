package com.programmingtechie.productservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryResponse {
    private String id;
    private String code;
    private String name;
    private String description;
    private String imageUrl;
    private String status;
    private Integer displayOrder;
}

