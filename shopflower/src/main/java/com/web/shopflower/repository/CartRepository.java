package com.web.shopflower.repository;

import com.web.shopflower.models.CartEntity;
import com.web.shopflower.models.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Long> {
    Optional<CartEntity> findByUserEntity(UserEntity userEntity);
}
