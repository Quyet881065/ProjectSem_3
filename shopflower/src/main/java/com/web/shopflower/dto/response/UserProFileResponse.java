package com.web.shopflower.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProFileResponse {
    private String id;
    private String userName;
    private String  fullName;
    private String email;
    private String avatar;
}
