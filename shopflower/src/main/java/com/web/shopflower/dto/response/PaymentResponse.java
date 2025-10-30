package com.web.shopflower.dto.response;

import com.web.shopflower.enums.PaymentMethod;
import com.web.shopflower.enums.PaymentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private String orderId;
    private Double amount;
    private PaymentMethod method;
    private PaymentStatus status ;
    private String transactionId;
    private LocalDateTime paidAt;
    private String paymentUrl;
}
