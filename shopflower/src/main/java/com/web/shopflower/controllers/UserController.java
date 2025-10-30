package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.UserRequest;
import com.web.shopflower.dto.response.UserProFileResponse;
import com.web.shopflower.dto.response.UserResponse;
import com.web.shopflower.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping()
    List<UserResponse> getAllUser(){
        return userService.getAllUser();
    }

    @PostMapping("/register")
    ApiResponse<UserResponse> createUser(@RequestBody UserRequest request){
       return  userService.createUser(request);
    }

    @GetMapping("/my-profile")
    ApiResponse<UserProFileResponse> getMyProfile(){
        return userService.getMyProfile();
    }

    @GetMapping("/total")
    ApiResponse<Long> getTotalUser(){
        long total = userService.getTotalUser();
        return ApiResponse.<Long>builder()
                .results(total)
                .message("success")
                .build();
    }
}
