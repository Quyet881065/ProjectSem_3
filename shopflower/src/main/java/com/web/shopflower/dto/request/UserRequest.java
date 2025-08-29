package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class UserRequest {
    private String username;
    private String  fullname;
    private String email;
    private String password;
    private Integer status;
}
