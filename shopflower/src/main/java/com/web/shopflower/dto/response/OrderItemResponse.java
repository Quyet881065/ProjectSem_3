package com.web.shopflower.dto.response;

import lombok.Data;

@Data
public class OrderItemResponse {
    private String flowerId;
    private String flowerName;
    private Integer quantity;
    private Double price;
    private String url;
}
