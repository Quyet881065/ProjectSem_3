package com.web.shopflower.models;

import com.web.shopflower.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class OrdersEntity {
    @GeneratedValue(strategy = GenerationType.UUID)
    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private OrderStatus status ;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Relationship users
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity userEntity;

    // Order item
    @OneToMany(mappedBy = "ordersEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> orderItem = new ArrayList<>();

    // Payments
    @OneToMany(mappedBy = "orders", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentsEntity> paymentsEntities = new ArrayList<>();
}
