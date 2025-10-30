package com.web.shopflower.models;

import com.web.shopflower.enums.PaymentMethod;
import com.web.shopflower.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class PaymentsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "payment_id")
    private String id;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

   // private String transactionId;
    private LocalDateTime paidAt;

    // quan he voi orders
    @ManyToOne
    @JoinColumn(name = "order_id")
    private OrdersEntity orders;
}
