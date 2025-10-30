package com.web.shopflower.dto.request;

import com.web.shopflower.enums.PaymentMethod;
import lombok.Data;

@Data
public class PaymentRequest {
    private PaymentMethod method;
    private Long amount;
    private String language;
}
