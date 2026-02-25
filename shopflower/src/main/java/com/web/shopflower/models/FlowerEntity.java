package com.web.shopflower.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "flower")
public class FlowerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String productName;
    @Column(name = "products_include")
    private String productsInclude;
    @Column(length = 10000)
    private String description;
    private String category;
    private Double price;
    private String url;

    private String bestSeller;

    // Order item
    @OneToMany(mappedBy = "flowerEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    List<OrderItemEntity> orderItem = new ArrayList<>();

    @OneToMany(mappedBy = "flower", cascade = CascadeType.ALL, orphanRemoval = true)
    List<CartItemEntity> cartItem = new ArrayList<>();
}
