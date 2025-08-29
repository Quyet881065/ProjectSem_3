package com.web.shopflower.dto.response;

import lombok.Data;

@Data
public class FlowerResponse {
    private String productName;
    private int years ;
    private Double price;
    private String url;
}
