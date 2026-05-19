package com.techshop.authservice.security;

import com.techshop.authservice.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JwtTokenProviderTests {

    @Test
    void shouldGenerateValidToken() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "jwtSecret",
                "TechShopJwtSecretKeyForHS512MustBeAtLeastSixtyFourBytesLong2026!");
        ReflectionTestUtils.setField(provider, "jwtExpirationMs", 86400000);

        String token = provider.generateToken(User.builder()
                .username("alice")
                .role("USER")
                .build());

        assertEquals("alice", provider.getUsername(token));
        assertEquals("USER", provider.getRole(token));
    }
}
