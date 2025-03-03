
import React, { useContext, useState, useEffect } from 'react'
import Title from '../components/Title'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import { useParams } from 'react-router-dom'
//import { IconName } from "react-icons/bs";
import { BsCheckCircle } from "react-icons/bs";
<BsCheckCircle />

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
        <div className='border-t py-20'>
            <div className='my-10 flex flex-col gap-2 items-center'>
                <div className='text-8xl '>
                    <BsCheckCircle className='text-green-500'/>
                </div>
                <p className='text-2xl'>Payment Successfull</p>
            </div>
            <div className='flex flex-col gap-5 my-5'>
                <div className='grid grid-cols-[2fr_1fr_1fr_2fr_1fr]'>
                    <p><strong>Delivery Address</strong></p>
                    <p><strong>Status</strong> </p>
                    <p><strong>Total</strong> </p>
                    <p><strong>Delivery Phone</strong> </p>
                    <p><strong>Payment Method</strong></p>
                </div>
                <div className='grid grid-cols-[2fr_1fr_1fr_2fr_1fr]'>
                    <p>{orderData.deliveryAddress}</p>
                    <p>{orderData.status}</p>
                    <p>${orderData.total}</p>
                    <p>{orderData.deliveryInfo?.recipientPhoneNo}</p>
                    <p>{orderData.paymentInfo?.paymentMethod}</p>
                </div>
            </div>
        </div>
    )
}

export default OrdersUser