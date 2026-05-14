package com.techshop.authservice.dto;

import com.techshop.authservice.model.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
    private Boolean locked;
    private LocalDateTime createdAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .locked(Boolean.TRUE.equals(user.getLocked()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}

