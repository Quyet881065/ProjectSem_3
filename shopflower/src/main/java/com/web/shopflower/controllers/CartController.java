package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.CartRequest;
import com.web.shopflower.dto.request.CartUpdateRequest;
import com.web.shopflower.dto.response.CartResponse;
import com.web.shopflower.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    @PostMapping("/create")
    ApiResponse<CartResponse> addOrUpdateToCart(@RequestBody CartRequest request){
        return ApiResponse.<CartResponse>builder()
                .results(cartService.addOrUpdateToCart(request.getUserId(), request.getFlowerId(), request.getQuantity()))
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<CartResponse> getCart(@PathVariable String userId) {
        return ApiResponse.<CartResponse>builder()
                .results(cartService.getCart(userId))
                .build();
    }


    @DeleteMapping("/delete/{cartItemId}")
    ResponseEntity<Void> deleteCartItem(@PathVariable Long cartItemId){
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear/{userId}")
    public CartResponse clearCart(@PathVariable String userId) {
        return cartService.clearCart(userId);
    }

//    @DeleteMapping("/remove")
//    public ResponseEntity<Void> removeItem(
//            @RequestParam String userId,
//            @RequestParam String flowerId) {
//        cartService.removeItem(userId, flowerId);
//        return ResponseEntity.ok().build();
//    }
//

}
