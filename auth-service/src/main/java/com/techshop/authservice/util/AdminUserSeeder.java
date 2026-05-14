package com.techshop.authservice.util;

import com.techshop.authservice.model.User;
import com.techshop.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (Boolean.FALSE.equals(userRepository.existsByUsername("admin"))) {
            userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@kdktech.local")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .locked(false)
                    .createdAt(LocalDateTime.now())
                    .build());
        }
    }
}

