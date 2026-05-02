package com.techshop.authservice.controller;

import com.techshop.authservice.dto.AuthResponse;
import com.techshop.authservice.dto.LoginRequest;
import com.techshop.authservice.dto.RegisterRequest;
import com.techshop.authservice.model.User;
import com.techshop.authservice.repository.UserRepository;
import com.techshop.authservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        // Xac thuc thong tin dang nhap
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Tao JWT token
        String jwt = tokenProvider.generateToken(authentication);
        
        return ResponseEntity.ok(new AuthResponse(jwt, "Dang nhap thanh cong"));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        // Kiem tra ton tai username
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return new ResponseEntity<>("Ten dang nhap da ton tai", HttpStatus.BAD_REQUEST);
        }

        // Kiem tra ton tai email
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Email da duoc su dung", HttpStatus.BAD_REQUEST);
        }

        // Tao user moi va hash password
        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role("USER")
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("Dang ky tai khoan thanh cong");
    }
}