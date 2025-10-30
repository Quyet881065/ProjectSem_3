package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class CartRequest {
    private String userId;
    private String flowerId;
    private int quantity = 1;
}
