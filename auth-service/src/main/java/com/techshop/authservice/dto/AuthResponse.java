package com.techshop.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message;
    private String username;
    private String role;

    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }
}
