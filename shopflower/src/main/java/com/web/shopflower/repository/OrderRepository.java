package com.web.shopflower.repository;

import com.web.shopflower.enums.OrderStatus;
import com.web.shopflower.models.OrdersEntity;
import com.web.shopflower.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrdersEntity, String> {
    List<OrdersEntity> findByUserEntity(UserEntity userEntity);
    List<OrdersEntity> findByUserEntityAndStatus(UserEntity userEntity, OrderStatus orderStatus);
}
