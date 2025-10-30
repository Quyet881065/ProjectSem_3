package com.web.shopflower.repository;

import com.web.shopflower.models.CartEntity;
import com.web.shopflower.models.CartItemEntity;
import com.web.shopflower.models.FlowerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    Optional<CartItemEntity> findByCartAndFlower(CartEntity cart, FlowerEntity flower);
    List<CartItemEntity> findByCart(CartEntity cart);
}
