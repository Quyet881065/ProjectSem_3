package com.web.shopflower.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private String userId;
    private String shippingAddress;
    private String fullName;
    private String phone;
    private List<OrderItemRequest> items;
}
