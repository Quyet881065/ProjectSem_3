package com.web.shopflower.controllers;

import com.web.shopflower.dto.request.UserRequest;
import com.web.shopflower.dto.response.UserResponse;
import com.web.shopflower.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping()
    List<UserResponse> getAllUser(){
        return userService.getAllUser();
    }

    @PostMapping("/create")
    UserResponse createUser(@RequestBody UserRequest request){
       return  userService.createUser(request);
    }
}
