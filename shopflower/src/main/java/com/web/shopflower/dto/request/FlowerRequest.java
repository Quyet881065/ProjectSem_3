package com.web.shopflower.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FlowerRequest {
    private String flowerName;
    private String productsInclude;
    private String description;
    private Double price;
    private String category;
    private MultipartFile imageFile;
    private String bestSeller;
}
