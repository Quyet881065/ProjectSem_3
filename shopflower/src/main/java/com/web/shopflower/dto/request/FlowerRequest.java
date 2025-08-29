package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class FlowerRequest {
    private String productName;
    private int years ;
    private Double price;
    private String url;
}
