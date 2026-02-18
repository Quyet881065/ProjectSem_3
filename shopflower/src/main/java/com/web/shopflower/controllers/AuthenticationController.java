package com.web.shopflower.controllers;

import com.nimbusds.jose.JOSEException;
import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.AuthenticationRequest;
import com.web.shopflower.dto.request.RefreshRequest;
import com.web.shopflower.dto.response.AuthenticationResponse;
import com.web.shopflower.service.impl.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authentication(@RequestBody AuthenticationRequest request){
        return authenticationService.authentication(request);
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        AuthenticationResponse result = authenticationService.refreshToken(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .results(result)
                .build();
    }
}
