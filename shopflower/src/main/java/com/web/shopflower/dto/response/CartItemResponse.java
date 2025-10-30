package com.web.shopflower.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {
    private Long cartItemId;
    private String flowerId;
    private String flowerName;
    private String imageUrl;
    private Double price;
    private Integer quantity;
    private Double totalPrice; // = price * quantity
}
