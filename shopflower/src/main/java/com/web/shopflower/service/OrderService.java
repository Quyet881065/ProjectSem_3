package com.web.shopflower.service;

import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.OrderRequest;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.dto.response.OrderItemResponse;
import com.web.shopflower.dto.response.OrderPaymentResponse;
import com.web.shopflower.dto.response.OrderResponse;
import com.web.shopflower.enums.OrderStatus;
import com.web.shopflower.models.*;
import com.web.shopflower.repository.FlowerRepository;
import com.web.shopflower.repository.OrderRepository;
import com.web.shopflower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final FlowerRepository flowerRepository;
    @Value("${app.media.url-prefix}")
    private String urlPrefix ;

    // create order
    public OrderResponse createOrder(OrderRequest request){
        UserEntity user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        OrdersEntity order = new OrdersEntity();
        order.setUserEntity(user);
        order.setShippingAddress(request.getShippingAddress());
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPhone(request.getPhone());
        order.setFullName(request.getFullName());

        double total =0;
        for(var item : request.getItems()){
            FlowerEntity flower = flowerRepository.findById(item.getFlowerId()).orElseThrow(()->
                    new RuntimeException("flowernot found"));
            OrderItemEntity orderItem = new OrderItemEntity();
            orderItem.setFlowerEntity(flower);
            orderItem.setOrdersEntity(order);
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());

            order.getOrderItem().add(orderItem);
            total += item.getPrice() * item.getQuantity();
        }
        order.setTotalAmount(total);
        orderRepository.save(order);
        return mapToOrderResponse(order);
    }

    // get all order
    public List<OrderResponse> getAllOrder(){
       List<OrdersEntity> orders = orderRepository.findAll();
       return orders.stream().map(order -> mapToOrderResponse(order)).toList();
    }

    // get order
    public OrderResponse getOrder(String orderId){
        OrdersEntity orders = orderRepository.findById(orderId).orElseThrow(()-> new RuntimeException("Order not found"));
        return mapToOrderResponse(orders);
    }
    // get order by user
    public ApiResponse<List<OrderPaymentResponse>> getOrderPaymentByUser(String userId, String status){
        // tim user
        UserEntity userEntity = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("user not found"));
        // lay tat ca order cua user do
        List<OrdersEntity> orders = new ArrayList<>();
        if(status == null || status.isBlank() || status.equalsIgnoreCase("All")){
            orders = orderRepository.findByUserEntity(userEntity);
        }else{
            try{
                OrderStatus orderStatus = OrderStatus.valueOf(status.toUpperCase());
                orders = orderRepository.findByUserEntityAndStatus(userEntity, orderStatus);
            }catch(IllegalArgumentException e){
                throw new RuntimeException("Invalid order status : " + status);
            }
        }
        if(orders.isEmpty()){
            throw new RuntimeException("No order not found this user");
        }
        List<OrderPaymentResponse> responseList = new ArrayList<>();
        // duyet qua tung don hang
        for(OrdersEntity order : orders){
            // Lay tat ca payment cua order
            List<PaymentsEntity> payments = order.getPaymentsEntities();
            // voi moi payment tao response
            for(PaymentsEntity paymentsEntity : payments){
                OrderPaymentResponse response = new OrderPaymentResponse();
                // thong tin payment
                response.setAmount(paymentsEntity.getAmount());
                response.setMethod(paymentsEntity.getMethod());
                response.setPaidAt(paymentsEntity.getPaidAt());
                response.setStatusPayment(paymentsEntity.getStatus());
                // thong tin order
                response.setStatusOrder(order.getStatus());
                response.setOrderId(order.getId());
                response.setCustomerName(order.getFullName());
                response.setTotalAmount(order.getTotalAmount());
                response.setOrderDate(order.getCreatedAt());
                // danh sach flower
                response.setFlowers(order.getOrderItem().stream().map(item -> {
                    FlowerResponse flowerResponse = new FlowerResponse();
                    flowerResponse.setId(item.getFlowerEntity().getId());
                    flowerResponse.setFlowerName(item.getFlowerEntity().getProductName());
                    flowerResponse.setPrice(item.getFlowerEntity().getPrice());
                    flowerResponse.setUrl(urlPrefix + item.getFlowerEntity().getUrl());
                    return flowerResponse;
                }).toList());
             responseList.add(response);
            }
        }
        log.info("List response order : {}", responseList);
        return ApiResponse.<List<OrderPaymentResponse>>builder()
                .results(responseList)
                .build();
    }

    public long getTotalOrders(){
        return orderRepository.count();
    }

    private OrderResponse mapToOrderResponse(OrdersEntity orders){
        OrderResponse response = new OrderResponse();
        response.setOrderId(orders.getId());
        response.setOrderStatus(orders.getStatus());
        response.setTotalAmount(orders.getTotalAmount());
        response.setShippingAddress(orders.getShippingAddress());
        response.setCreateAt(orders.getCreatedAt());
        response.setUserId(orders.getUserEntity().getId());
        response.setPhone(orders.getPhone());
        response.setFullName(orders.getFullName());

        // map list OrderItemEntity -> OrderItemResponse
        List<OrderItemResponse> items = orders.getOrderItem().stream().map(item -> {
            OrderItemResponse dto = new OrderItemResponse();
            dto.setFlowerId(item.getFlowerEntity().getId());
            dto.setFlowerName(item.getFlowerEntity().getProductName());
            dto.setPrice(item.getPrice());
            dto.setQuantity(item.getQuantity());
            dto.setUrl(urlPrefix + item.getFlowerEntity().getUrl());
            return dto;
        }).toList();

        response.setItems(items);
        return response;
    }
}
