package com.web.shopflower.dto.request;

import lombok.Data;

@Data
public class RefundRequest {
    private String tranType;
    private String orderId;
    private long amount;
    private String transDate;
    private String user;
}
