package com.web.shopflower.dto.response;

import lombok.Data;

import java.time.Instant;
import java.util.Date;

@Data
public class AuthenticationResponse {
    private String token;
    private String role;
    private Instant expiryTime;
    private String userId;
}
