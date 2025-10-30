package com.web.shopflower.exception;

import com.web.shopflower.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandle {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse> handlingAppException(AppException ex){
        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setStatusCode(errorCode.getCode());
        apiResponse.setMessage(errorCode.getMessage());
        return ResponseEntity.status(errorCode.getStatusCode())
                .body(apiResponse);
    }
}
