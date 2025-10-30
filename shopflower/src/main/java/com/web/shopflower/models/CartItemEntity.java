package com.web.shopflower.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private CartEntity cart;

    @ManyToOne
    @JoinColumn(name = "flower_id")
    private FlowerEntity flower;

    private Integer quantity;
    private Double flowerPrice;
}
