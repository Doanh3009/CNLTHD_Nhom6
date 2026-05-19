package com.programming.techie.apigateway.config;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class SecurityConfigTests {

    @Test
    void createsHs256JwtDecoderFromSharedSecret() {
        SecurityConfig securityConfig = new SecurityConfig();

        ReactiveJwtDecoder decoder = securityConfig.reactiveJwtDecoder("mysecretkey123456789012345678901234567890");

        assertNotNull(decoder);
    }
}
