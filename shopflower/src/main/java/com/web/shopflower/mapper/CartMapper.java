package com.web.shopflower.mapper;

import com.web.shopflower.dto.response.CartItemResponse;
import com.web.shopflower.dto.response.CartResponse;
import com.web.shopflower.models.CartEntity;
import com.web.shopflower.models.CartItemEntity;

import java.util.List;
import java.util.stream.Collectors;

public class CartMapper {
    private static final String urlPrefix = "http://localhost:8080/flowers/media/download/";
    public static CartResponse toCartDTO(CartEntity cart) {
        List<CartItemResponse> items = cart.getCartItems().stream()
                .map(CartMapper::toCartItemDTO)
                .collect(Collectors.toList());

        return new CartResponse(
                cart.getCartId(),
                cart.getUserEntity().getId(),
                cart.getTotalPrice(),
                items
        );
    }
    public static CartItemResponse toCartItemDTO(CartItemEntity item) {
        return new CartItemResponse(
                item.getCartItemId(),
                item.getFlower().getId(),
                item.getFlower().getProductName(),
                urlPrefix + item.getFlower().getUrl(),
                item.getFlower().getPrice(),
                item.getQuantity(),
                item.getFlowerPrice()
        );
    }
}
