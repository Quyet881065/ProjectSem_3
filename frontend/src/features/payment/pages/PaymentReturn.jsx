
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getToken } from "../../../service/localStorageService";

const PaymentReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const token = getToken();
        const queryString = searchParams.toString(); // lấy toàn bộ params từ VNPay

        const response = await axios.get(
          `http://localhost:8080/payment/vnpay-return?${queryString}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("VNPay return:", response.data);

        // Nếu thanh toán thành công thì điều hướng về chi tiết đơn hàng
        if (response.data.results === "OK") {
          const orderId = searchParams.get("vnp_TxnRef");
          console.log("Order ID from vnp_TxnRef:", orderId);
          navigate(`/view-order/${orderId}`);
        } else {
          navigate("/payment-failed");
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
        navigate("/payment-failed");
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-10">
      <h2>Đang xử lý kết quả thanh toán...</h2>
    </div>
  );
};

export default PaymentReturn;
