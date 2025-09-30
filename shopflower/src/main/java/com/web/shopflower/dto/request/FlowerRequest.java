package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class FlowerRequest {
    private String productName;
    private String productsInclude;
    private String description;
    private Double price;
    private String url;
}
