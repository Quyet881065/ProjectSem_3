package com.web.shopflower.enums;

public enum PaymentMethod {
    CASH("Thanh toán tiền mặt"),
    BANK_TRANSFER("Chuyển khoản");

    PaymentMethod(String method){
        this.method = method;
    }
    private String method;

    public String getMethod(){
        return method;
    }
}
