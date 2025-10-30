package com.web.shopflower.dto.response;

import com.web.shopflower.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private String orderId;
    private OrderStatus orderStatus;
    private double totalAmount;
    private String shippingAddress;
    private LocalDateTime createAt;
    private String userId;
    private String phone;
    private String fullName;
    private List<OrderItemResponse> items;
}
