package com.web.shopflower.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    USER_EXISTS(1001, "The login name already exists", HttpStatus.BAD_REQUEST);

    ErrorCode(int code, String message, HttpStatusCode statusCode){
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    private int code ;
    private String message;
    private HttpStatusCode statusCode;
}
