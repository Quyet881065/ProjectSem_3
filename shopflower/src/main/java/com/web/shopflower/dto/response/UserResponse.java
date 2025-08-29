package com.web.shopflower.dto.response;

import com.web.shopflower.models.RoleEntity;
import lombok.Data;

import java.util.List;

@Data
public class UserResponse {
    private String username;
    private String  fullname;
    private String email;
    private String password;
    private Integer status;
    private List<RoleEntity> role;
}
