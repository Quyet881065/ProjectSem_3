package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class CartUpdateRequest {
    private Long cartId;
    private int quantity;
}
