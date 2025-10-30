package com.web.shopflower.service;

import com.web.shopflower.dto.request.CartUpdateRequest;
import com.web.shopflower.dto.response.CartItemResponse;
import com.web.shopflower.dto.response.CartResponse;
import com.web.shopflower.mapper.CartMapper;
import com.web.shopflower.models.CartEntity;
import com.web.shopflower.models.CartItemEntity;
import com.web.shopflower.models.FlowerEntity;
import com.web.shopflower.models.UserEntity;
import com.web.shopflower.repository.CartItemRepository;
import com.web.shopflower.repository.CartRepository;
import com.web.shopflower.repository.FlowerRepository;
import com.web.shopflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {
    private final UserRepository userRepository;
    private final FlowerRepository flowerRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartResponse addOrUpdateToCart(String userId, String flowerId, int quantity){
        // Tim user
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(()
                -> new RuntimeException("User not found"));
        log.info("user entity : {}", userEntity);
        // Tim flower
        FlowerEntity flowerEntity = flowerRepository.findById(flowerId).orElseThrow(()->
                new RuntimeException("Flower not found"));
        log.info("flower : {}", flowerEntity);
        // Tìm cart của user, nếu chưa có thì tạo mới
        CartEntity cart = cartRepository.findByUserEntity(userEntity).orElseGet(()->{
            CartEntity newCart= new CartEntity();
            newCart.setTotalPrice(0.0);
            newCart.setUserEntity(userEntity);
            return cartRepository.save(newCart);
        });
        log.info("cart entity : {}", cart);
        // Kiểm tra xem item đã tồn tại trong cart chưa
       CartItemEntity existingItem = cartItemRepository.findByCartAndFlower(cart, flowerEntity).orElse(null);
        log.info("existing item : {}", existingItem);
        if (existingItem != null) {
            // Nếu tồn tại -> cộng dồn số lượng
            int updateQuantity = quantity;
            existingItem.setQuantity(updateQuantity);
            existingItem.setFlowerPrice(flowerEntity.getPrice());
            existingItem =  cartItemRepository.save(existingItem);
            log.info("update item1 : {}", existingItem);
        } else {
            // Nếu chưa có -> thêm mới
            CartItemEntity newItem = new CartItemEntity();
            newItem.setCart(cart);
            newItem.setFlower(flowerEntity);
            newItem.setQuantity(quantity);
            newItem.setFlowerPrice(flowerEntity.getPrice());
            cart.getCartItems().add(newItem);
            newItem = cartItemRepository.save(newItem);
            log.info("create item2 : {}", newItem);
        }
        // Cập nhật lại totalPrice
        List<CartItemEntity> allItems = cartItemRepository.findByCart(cart);
        double total = allItems.stream()
                .mapToDouble(CartItemEntity::getFlowerPrice)
                .sum();
        cart.setTotalPrice(total);
        cart = cartRepository.save(cart);
        return CartMapper.toCartDTO(cart);
    }

    // Lấy cart của user
    public CartResponse getCart(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartEntity cart = cartRepository.findByUserEntity(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        return CartMapper.toCartDTO(cart);
    }

    // Xoá item
    public void deleteCartItem(Long cartItemId) {
       if(!cartItemRepository.existsById(cartItemId)){
            throw new RuntimeException("Cart item not found with id : " + cartItemId);
       }
       cartItemRepository.deleteById(cartItemId);
    }

    // Clear cart
    public CartResponse clearCart(String userId) {
        // Tìm user
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Tìm cart của user
        CartEntity cart = cartRepository.findByUserEntity(userEntity)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
        // Xóa hết cartItems (cascade = ALL + orphanRemoval = true sẽ lo phần DB)
        cart.getCartItems().clear();
        cart.setTotalPrice(0.0);
        // Lưu lại
        cart = cartRepository.save(cart);
        return CartMapper.toCartDTO(cart);
    }
}
