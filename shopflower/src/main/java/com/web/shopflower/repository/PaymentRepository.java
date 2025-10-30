package com.web.shopflower.repository;

import com.web.shopflower.models.OrdersEntity;
import com.web.shopflower.models.PaymentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentsEntity, String> {
    Optional<PaymentsEntity> findByOrders(OrdersEntity orders);
}
