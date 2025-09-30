package com.web.shopflower.models;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "flower")
public class FlowerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String productName;
    @Column(name = "products_include")
    private String productsInclude;
    private String description;
    private String category;
    private Double price;
    private String url;

    // Order item
    @OneToMany(mappedBy = "flowerEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItemEntity> orderItem = new ArrayList<>();
}
