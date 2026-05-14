package com.techshop.authservice.security;

import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.util.ReflectionTestUtils;

class JwtTokenProviderTests {

    @Test
    void shouldGenerateValidToken() {
        JwtTokenProvider provider = new JwtTokenProvider();
        ReflectionTestUtils.setField(provider, "jwtSecret",
                "TechShopJwtSecretKeyForHS512MustBeAtLeastSixtyFourBytesLong2026!");
        ReflectionTestUtils.setField(provider, "jwtExpirationInMs", 86400000);

        String token = provider.generateToken(new UsernamePasswordAuthenticationToken(
                "alice", "password", List.of(new SimpleGrantedAuthority("ROLE_USER"))));

        Assertions.assertTrue(provider.validateToken(token));
    }
}
