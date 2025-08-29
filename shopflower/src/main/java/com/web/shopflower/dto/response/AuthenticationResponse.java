package com.web.shopflower.dto.response;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private String token;
    private boolean authentication;
}
