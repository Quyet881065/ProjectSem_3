package com.web.shopflower.controllers;

import com.web.shopflower.configuration.VnPayConfig;
import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.PaymentRequest;
import com.web.shopflower.dto.response.OrderPaymentResponse;
import com.web.shopflower.dto.response.PaymentResponse;
import com.web.shopflower.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/{orderId}")
    ApiResponse<List<OrderPaymentResponse>> getPaymentByOrderId(@PathVariable String orderId){
        return paymentService.getPaymentByOrderId(orderId);
    }

    @PostMapping("/{orderId}")
    public ApiResponse<PaymentResponse> createPayment(
            @PathVariable String orderId,
            @RequestBody PaymentRequest paymentRequest,
            HttpServletRequest request) {

        log.info("💳 Creating payment for orderId: {}, method: {}", orderId, paymentRequest.getMethod());
        PaymentResponse response = paymentService.createPayment(orderId, paymentRequest, request);

        return ApiResponse.<PaymentResponse>builder()
                //.message("Payment created successfully")
                .results(response)
                .build();
    }

    @GetMapping("/vnpay-return")
    public ApiResponse<String> handleVnPayReturn(
            @RequestParam Map<String, String> queryParams,
            Principal principal) {

        String orderId = queryParams.get("vnp_TxnRef");
        String responseCode = queryParams.get("vnp_ResponseCode");
        log.info("Order id: {}", orderId);
        log.info("Response code : {}", responseCode);

        boolean success = "00".equals(responseCode);

        paymentService.confirmPayment(orderId, success);

        if (success) {
            return ApiResponse.<String>builder()
                   // .message("Payment success")
                    .results("OK")
                    .build();
        } else {
            return ApiResponse.<String>builder()
                   // .message("Payment failed")
                    .results("FAILED")
                    .build();
        }
    }



    @GetMapping("/pay")
    public String getPay() throws UnsupportedEncodingException {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = 10000*100;
        String bankCode = "NCB";

        String vnp_TxnRef = VnPayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;
        log.info("payment url : {}", paymentUrl);
        return paymentUrl;
    }
}
