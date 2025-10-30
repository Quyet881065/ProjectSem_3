package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class OrderItemRequest {
    private String flowerId;
    private Integer quantity;
    private Double price;
}
