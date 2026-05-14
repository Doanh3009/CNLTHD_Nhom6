package com.programmingtechie.productservice.dto;

import lombok.Data;

@Data
public class CategoryRequest {
    private String code;
    private String name;
    private String description;
    private String imageUrl;
    private String status;
    private Integer displayOrder;
}

