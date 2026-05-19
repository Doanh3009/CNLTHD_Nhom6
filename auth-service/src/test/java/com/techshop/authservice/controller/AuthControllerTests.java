package com.techshop.authservice.controller;

import com.techshop.authservice.dto.AdminUserRequest;
import com.techshop.authservice.dto.LoginRequest;
import com.techshop.authservice.dto.UserResponse;
import com.techshop.authservice.model.User;
import com.techshop.authservice.repository.UserRepository;
import com.techshop.authservice.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTests {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        authController = new AuthController(authenticationManager, userRepository, passwordEncoder, tokenProvider);
    }

    @Test
    void adminCreateUserAlwaysCreatesCustomerUser() {
        AdminUserRequest request = new AdminUserRequest();
        request.setUsername("alice");
        request.setEmail("alice@example.com");
        request.setPassword("secret123");
        request.setRole("ADMIN");
        when(tokenProvider.getRole("admin-token")).thenReturn("ADMIN");
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(9L);
            return user;
        });

        UserResponse response = authController.createUser("Bearer admin-token", request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        assertEquals("USER", captor.getValue().getRole());
        assertFalse(captor.getValue().getLocked());
        assertEquals("USER", response.getRole());
    }

    @Test
    void customerLoginRejectsAdminAccount() {
        LoginRequest request = new LoginRequest();
        request.setUsername("admin");
        request.setPassword("password");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken("admin", "password"));
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(User.builder()
                .username("admin")
                .password("password")
                .role("ADMIN")
                .locked(false)
                .build()));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> authController.login(request));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }
}
