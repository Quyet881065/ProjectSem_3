package com.web.shopflower.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartResponse {
    private Long cartId;
    private String userId;
    private Double totalPrice;
    private List<CartItemResponse> items;
}
