
import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'

const OrdersUser = () => {
    const { backendurl } = useContext(ShopContext)
    const [orderData, setOrderData] = useState(null)

    const { orderId } = useParams();
    const storedOrderId = localStorage.getItem('orderId');

    useEffect(() => {
        const idToFetch = orderId || storedOrderId;  // Choose orderId from params or localStorage
        if (idToFetch) {
            getDetailsOrder(idToFetch);
        }
    }, [orderId, storedOrderId]);

    const getDetailsOrder = async (orderId) => {
        try {
            const response = await axios.get(backendurl + `/api/Orders/${orderId}`);
            if (response.data.success) {
                setOrderData(response.data.data)
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }
    if (!orderData) {
        return <div>Loading...</div>;
    }
    console.log(orderData);
    return (
        <div className='border-t'>
            <div>
                <Title text1={"MY"} text2={"ORDERS"} />
            </div>
            <div>
               <div>
               <p><strong>Delivery Address:</strong> {orderData.deliveryAddress}</p>
               <p><strong>Status:</strong> {orderData.status}</p>
                <p><strong>Total:</strong> ${orderData.total}</p>
                <p><strong>Delivery Phone:</strong> {orderData.deliveryInfo?.recipientPhoneNo}</p>
                <p><strong>Payment Method:</strong> {orderData.paymentInfo?.paymentMethod}</p>
               </div>
            </div>
        </div>
    )
}

export default OrdersUser