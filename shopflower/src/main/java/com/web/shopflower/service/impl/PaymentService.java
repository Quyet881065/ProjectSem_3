package com.web.shopflower.service.impl;

import com.web.shopflower.configuration.VnPayConfig;
import com.web.shopflower.dto.ApiResponse;
import com.web.shopflower.dto.request.PaymentRequest;
import com.web.shopflower.dto.response.FlowerResponse;
import com.web.shopflower.dto.response.OrderPaymentResponse;
import com.web.shopflower.dto.response.PaymentResponse;
import com.web.shopflower.enums.OrderStatus;
import com.web.shopflower.enums.PaymentMethod;
import com.web.shopflower.enums.PaymentStatus;
import com.web.shopflower.models.OrdersEntity;
import com.web.shopflower.models.PaymentsEntity;
import com.web.shopflower.repository.OrderRepository;
import com.web.shopflower.repository.PaymentRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${app.media.url-prefix}")
    private String urlPrefix;

    private final VnPayConfig config;

//    @Value("${vnpay.tmn-code}")
//    private String vnpTmnCode;
//
//    @Value("${vnpay.secret-key}")
//    private String secretKey;
//
//    @Value("${vnpay.pay-url}")
//    private String payUrl;
//
//    @Value("${vnpay.return-url}")
//    private String returnUrl;

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    // Debug xem .env có load không
//    @PostConstruct
//    public void checkConfig() {
//        log.info("VNPay TMN Code: {}", vnpTmnCode);
//        log.info("secret key : {}", secretKey);
//        log.info("VNPay Return URL: {}", returnUrl);
//    }

    // ========================= CREATE PAYMENT =========================

    public PaymentResponse createPayment(String orderId, PaymentRequest request, HttpServletRequest httpServletRequest){
        // Tim order
        OrdersEntity ordersEntity = orderRepository.findById(orderId).orElseThrow(() ->new RuntimeException("Order not found"));

        // Tao payment
        PaymentsEntity paymentsEntity = new PaymentsEntity();
        paymentsEntity.setOrders(ordersEntity);
        paymentsEntity.setStatus(PaymentStatus.PENDING);
        paymentsEntity.setMethod(request.getMethod());
        paymentsEntity.setPaidAt(LocalDateTime.now());
        paymentsEntity.setAmount(request.getAmount() != null ? request.getAmount() : ordersEntity.getTotalAmount());

        // Nếu là COD thì confirm ngay (không cần gateway)
        if(request.getMethod() == PaymentMethod.COD){
            paymentsEntity.setStatus(PaymentStatus.COMPLETED);
            paymentRepository.save(paymentsEntity);
            return toPaymentResponse(paymentsEntity);
        }
        // Neu la VNPay
        if(request.getMethod() == PaymentMethod.VNPAY){
            try {
                // Lấy IP từ request
                String ipAddress = httpServletRequest.getRemoteAddr();

                // VNPay KHÔNG chấp nhận IPv6 localhost (::1)
                if ("0:0:0:0:0:0:0:1".equals(ipAddress)) {
                    ipAddress = "127.0.0.1";
                }

                // Gọi sang service tạo URL VNPay
                String paymentUrl = createVnPayUrl(ordersEntity, ipAddress);

                // Lưu payment vào DB
                paymentRepository.save(paymentsEntity);

                // Tạo response kèm URL
                PaymentResponse paymentResponse = toPaymentResponse(paymentsEntity);
                paymentResponse.setPaymentUrl(paymentUrl);
                log.info("Payment response :{}", paymentResponse);
                return paymentResponse;

            } catch (Exception e) {
                throw new RuntimeException("Error while creating VNPay payment URL", e);
            }
        }
        throw new RuntimeException("Unsupported payment method");
    }

    // ========================= CREATE VNPAY URL =========================

    private String createVnPayUrl(OrdersEntity order, String ipAddress) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = (long) (order.getTotalAmount() * 100); // VNPay nhân 100
        String bankCode = "NCB";

        String vnp_TxnRef = order.getId();
        String vnp_TmnCode = config.getTmnCode();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + order.getId());
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", config.getReturnUrl());
        vnp_Params.put("vnp_IpAddr", ipAddress);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (Iterator<String> itr = fieldNames.iterator(); itr.hasNext(); ) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                        .append('=')
                        .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String vnp_SecureHash = VnPayConfig.hmacSHA512(config.getSecretKey(), hashData.toString());
        query.append("&vnp_SecureHash=").append(vnp_SecureHash);
        return config.getPayUrl() + "?" + query.toString();
    }

    private String hmacSHA512(String key, String data) throws Exception {

        Mac mac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKeySpec =
                new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");

        mac.init(secretKeySpec);

        byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder();
        for (byte b : hashBytes) {
            sb.append(String.format("%02x", b));
        }

        return sb.toString();
    }

    // ========================= CONFIRM PAYMENT =========================

    public void confirmPayment(String orderId, boolean success) {

        OrdersEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentsEntity payment = paymentRepository.findByOrders(order)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (success) {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaidAt(LocalDateTime.now());
            order.setStatus(OrderStatus.PAID);
        } else {
            payment.setStatus(PaymentStatus.FAILED);
            order.setStatus(OrderStatus.PENDING);
        }

        paymentRepository.save(payment);
        orderRepository.save(order);
    }

    private PaymentResponse toPaymentResponse(PaymentsEntity payment) {

        PaymentResponse response = new PaymentResponse();
        response.setOrderId(payment.getOrders().getId());
        response.setAmount(payment.getAmount());
        response.setMethod(payment.getMethod());
        response.setStatus(payment.getStatus());
        response.setPaidAt(payment.getPaidAt());

        return response;
    }

    public ApiResponse<List<OrderPaymentResponse>> getPaymentByOrderId(String orderId) {

        OrdersEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<PaymentsEntity> payments = order.getPaymentsEntities();

        if (payments == null || payments.isEmpty()) {
            throw new RuntimeException("No payment found for this order");
        }

        List<OrderPaymentResponse> responseList = new ArrayList<>();

        for (PaymentsEntity payment : payments) {

            OrderPaymentResponse response = new OrderPaymentResponse();

            response.setOrderId(order.getId());
            response.setTotalAmount(order.getTotalAmount());
            response.setOrderDate(order.getCreatedAt());
            response.setCustomerName(order.getFullName());

            response.setAmount(payment.getAmount());
            response.setMethod(payment.getMethod());
            response.setStatusPayment(payment.getStatus());
            response.setPaidAt(payment.getPaidAt());

            response.setFlowers(
                    order.getOrderItem().stream().map(item -> {
                        FlowerResponse flower = new FlowerResponse();
                        flower.setId(item.getFlowerEntity().getId());
                        flower.setFlowerName(item.getFlowerEntity().getProductName());
                        flower.setPrice(item.getFlowerEntity().getPrice());
                        flower.setUrl(urlPrefix + item.getFlowerEntity().getUrl());
                        return flower;
                    }).toList()
            );

            responseList.add(response);
        }

        return ApiResponse.<List<OrderPaymentResponse>>builder()
                .results(responseList)
                .build();
    }
}