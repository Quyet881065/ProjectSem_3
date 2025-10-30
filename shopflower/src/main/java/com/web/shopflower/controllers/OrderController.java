package com.web.shopflower.controllers;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.OrderRequest;
import com.web.shopflower.dto.response.OrderPaymentResponse;
import com.web.shopflower.dto.response.OrderResponse;
import com.web.shopflower.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/create")
    OrderResponse createOrder(@RequestBody OrderRequest request){
        return orderService.createOrder(request);
    }

    @GetMapping("")
    List<OrderResponse> getAllOrder(){
        return orderService.getAllOrder();
    }

    @GetMapping("/{orderId}")
    OrderResponse getOrderId(@PathVariable("orderId") String orderId){
        return orderService.getOrder(orderId);
    }

    @GetMapping("/user/{userId}")
    ApiResponse<List<OrderPaymentResponse>> getOrderPaymentByUser(@PathVariable("userId") String userId,
                                                                  @RequestParam(required = false) String status){
        return orderService.getOrderPaymentByUser(userId, status);
    }
    @GetMapping("/total")
    ApiResponse<Long> getTotalOrders(){
        long total = orderService.getTotalOrders();
        return ApiResponse.<Long>builder()
                .results(total)
                .message("success")
                .build();
    }
}
