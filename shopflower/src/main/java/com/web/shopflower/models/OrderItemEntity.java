package com.web.shopflower.models;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items")
@Data
public class OrderItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private Integer quantity;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrdersEntity ordersEntity;

    @ManyToOne
    @JoinColumn(name = "flower_id")
    private FlowerEntity flowerEntity;
}
