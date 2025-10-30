package com.web.shopflower.dto.response;

import com.web.shopflower.enums.OrderStatus;
import com.web.shopflower.enums.PaymentMethod;
import com.web.shopflower.enums.PaymentStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderPaymentResponse {
    // Thông tin payment
    private Double amount;
    private PaymentMethod method;
    private PaymentStatus statusPayment;
    private OrderStatus statusOrder;
    private LocalDateTime paidAt;

    // Thông tin order
    private String orderId;
    private Double totalAmount;
    private LocalDateTime orderDate;
    private String customerName;

    // Danh sách sản phẩm trong order (hoa)
    private List<FlowerResponse> flowers;
}
