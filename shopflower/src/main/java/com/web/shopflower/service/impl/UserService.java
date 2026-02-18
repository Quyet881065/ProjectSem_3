package com.web.shopflower.service.impl;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.UserRequest;
import com.web.shopflower.dto.response.UserProFileResponse;
import com.web.shopflower.dto.response.UserResponse;
import com.web.shopflower.enums.Role;
import com.web.shopflower.exception.AppException;
import com.web.shopflower.exception.ErrorCode;
import com.web.shopflower.models.RoleEntity;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.RoleRepository;
import com.web.shopflower.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class UserService {
    @Autowired
     private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private RoleRepository roleRepository;

    public ApiResponse<UserResponse> createUser(UserRequest request){

        // Nếu username đã tồn tại → ném lỗi USER_EXISTS
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        UserEntity newUser = new UserEntity();
        newUser.setUserName(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setFullName(request.getFullname());
        newUser.setPassWord(passwordEncoder.encode(request.getPassword()));
        newUser.setStatus(1);

        RoleEntity userRole = roleRepository.findByCode(Role.USER.name())
                          .orElseThrow(() -> new RuntimeException("Role found"));
        // Gan role vao user
        newUser.getRoles().add(userRole);
        UserEntity userEntity = userRepository.save(newUser);
        return ApiResponse.<UserResponse>builder()
                .results(toUserResponse(userEntity))
                .message("Registration successfully ! Please log in continue")
                .statusCode(201)
                .build();
    }

    public List<UserResponse> getAllUser(){
        List<UserEntity> userEntity = userRepository.findAll();

        List<UserResponse> userResponses = new ArrayList<>();
        for(UserEntity user : userEntity){
            UserResponse userResponse = new UserResponse();
            userResponse.setFullname(user.getFullName());
            userResponse.setEmail(user.getEmail());
            userResponse.setRole(user.getRoles());
            userResponse.setStatus(user.getStatus());
            userResponse.setUsername(user.getFullName());
            userResponses.add(userResponse);
        }
        return userResponses;
    }

    public ApiResponse<UserProFileResponse> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userid = authentication.getName();
        UserEntity userEntity = userRepository.findById(userid).orElseThrow(() ->
                new RuntimeException("user not found"));

        log.info("userid {}", userid);

        UserProFileResponse userProFileResponse = new UserProFileResponse();
        userProFileResponse.setId(userEntity.getId());
        userProFileResponse.setEmail(userEntity.getEmail());
        userProFileResponse.setFullName(userEntity.getFullName());
        userProFileResponse.setUserName(userEntity.getUserName());
        ApiResponse<UserProFileResponse> apiResponse = new ApiResponse<>();
        apiResponse.setResults(userProFileResponse);
        return apiResponse;
    }

    public long getTotalUser(){
        return userRepository.count();
    }

    private UserResponse toUserResponse(UserEntity userEntity){
        UserResponse userResponse = new UserResponse();
        userResponse.setFullname(userResponse.getFullname());
        userResponse.setEmail(userEntity.getEmail());
        userResponse.setUsername(userEntity.getUserName());
        userResponse.setRole(userEntity.getRoles());
        userResponse.setStatus(userResponse.getStatus());
        return userResponse;
    }
}
