import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';

const ConfirmPayment = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const sessionId = searchParams.get('session_id');
    const {backendurl, clearCart} = useContext(ShopContext);

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                // Gọi API xác nhận thanh toán từ backend
                const response = await axios.get(`${backendurl}/api/Payment/confirm-payment/${sessionId}`);

                if (response.data.message) {
                    await clearCart();
                    // Điều hướng tới trang chi tiết đơn hàng sau khi thanh toán thành công
                    navigate(`/orders/${localStorage.getItem('orderId')}`);
                }
            } catch (error) {
                console.error('Error confirming payment:', error);
                alert('Failed to confirm payment');
            }
        };

        if (sessionId) {
            confirmPayment();
        }
    }, [sessionId, navigate]);

    return <div>Confirming payment, please wait...</div>;
};

export default ConfirmPayment;
