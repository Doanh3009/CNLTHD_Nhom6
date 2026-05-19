package com.techshop.authservice.controller;

import com.techshop.authservice.dto.AdminUserRequest;
import com.techshop.authservice.dto.AuthResponse;
import com.techshop.authservice.dto.LoginRequest;
import com.techshop.authservice.dto.RegisterRequest;
import com.techshop.authservice.dto.UserResponse;
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
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

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
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = findUser(loginRequest.getUsername());
        ensureUnlocked(user);
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tai khoan quan tri chi duoc dang nhap o trang admin");
        }
        String jwt = tokenProvider.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(jwt, "Dang nhap thanh cong", user.getUsername(), user.getRole()));
    }

    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = findUser(loginRequest.getUsername());
        ensureUnlocked(user);
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tai khoan khong co quyen quan tri");
        }
        String jwt = tokenProvider.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(jwt, "Dang nhap quan tri thanh cong", user.getUsername(), "ADMIN"));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest registerRequest) {
        validateAccount(registerRequest.getUsername(), registerRequest.getEmail(), registerRequest.getPassword());
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return new ResponseEntity<>("Ten dang nhap da ton tai", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Email da duoc su dung", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role("USER")
                .locked(false)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("Dang ky tai khoan thanh cong");
    }

    @GetMapping("/admin/users")
    public List<UserResponse> getUsers(@RequestHeader(value = "Authorization", required = false) String authorization) {
        requireAdmin(authorization);
        return userRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(UserResponse::from)
                .toList();
    }

    @PostMapping("/admin/users")
    public UserResponse createUser(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody AdminUserRequest request
    ) {
        requireAdmin(authorization);
        validateAccount(request.getUsername(), request.getEmail(), request.getPassword());
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ten dang nhap da ton tai");
        }
        if (request.getEmail() != null && userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email da duoc su dung");
        }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .locked(false)
                .createdAt(LocalDateTime.now())
                .build();
        return UserResponse.from(userRepository.save(user));
    }

    @PutMapping("/admin/users/{id}/lock")
    public UserResponse lockUser(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id
    ) {
        requireAdmin(authorization);
        User user = findUser(id);
        user.setLocked(true);
        return UserResponse.from(userRepository.save(user));
    }

    @PutMapping("/admin/users/{id}/unlock")
    public UserResponse unlockUser(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable Long id
    ) {
        requireAdmin(authorization);
        User user = findUser(id);
        user.setLocked(false);
        return UserResponse.from(userRepository.save(user));
    }

    private User findUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai thong tin dang nhap"));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Khong tim thay tai khoan"));
    }

    private void ensureUnlocked(User user) {
        if (Boolean.TRUE.equals(user.getLocked())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tai khoan da bi khoa");
        }
    }

    private void validateAccount(String username, String email, String password) {
        if (username == null || !username.matches("^[A-Za-z0-9_.-]{3,32}$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ten dang nhap chi gom chu, so, dau . _ - va dai 3-32 ky tu");
        }
        if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email khong hop le");
        }
        if (password == null || password.length() < 6 || password.length() > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mat khau phai dai tu 6 den 72 ky tu");
        }
    }

    private void requireAdmin(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Thieu token quan tri");
        }
        String token = authorization.substring("Bearer ".length());
        String role = tokenProvider.getRole(token);
        if (!"ADMIN".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Khong co quyen quan tri");
        }
    }
}
