package com.techshop.authservice.dto;

import lombok.Data;

@Data
public class AdminUserRequest {
    private String username;
    private String email;
    private String password;
    private String role;
}

