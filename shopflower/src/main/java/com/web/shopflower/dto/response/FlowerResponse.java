package com.web.shopflower.dto.response;

import lombok.Data;

@Data
public class FlowerResponse {
    private String id;
    private String flowerName;
    private String flowerInclude;
    private String description;
    private Double price;
    private String url;
}
