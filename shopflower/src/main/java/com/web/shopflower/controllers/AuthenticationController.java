package com.web.shopflower.controllers;

import com.web.shopflower.dto.request.AuthenticationRequest;
import com.web.shopflower.dto.response.AuthenticationResponse;
import com.web.shopflower.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    AuthenticationResponse authentication(@RequestBody AuthenticationRequest request){
        return authenticationService.authentication(request);
    }
}
