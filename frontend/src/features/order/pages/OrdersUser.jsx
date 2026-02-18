
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { ShopContext } from '../../../context/ShopContext'
import { useParams } from 'react-router-dom'
import { getToken } from '../../../service/localStorageService'
//import { IconName } from "react-icons/bs";
import { BsCheckCircle } from "react-icons/bs";
<BsCheckCircle />
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { assets } from '../../../assets/assets'

const OrdersUser = () => {
    const { backendurl, navigate } = useContext(ShopContext)
    const [orderData, setOrderData] = useState([])
    const [method, setMethod] = useState("COD")

    const { orderId } = useParams();
    //const storedOrderId = localStorage.getItem('orderId');

    useEffect(() => {
        const idToFetch = orderId || storedOrderId;  // Choose orderId from params or localStorage
        if (idToFetch) {
            getDetailsOrder(idToFetch);
        }
    }, [orderId]);

    console.log("Order ID:", orderId);

    const getDetailsOrder = async (orderId) => {
        try {
            const response = await axios.get(backendurl + `/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            if (response.data) {
                setOrderData(response.data);
                console.log('Order Details:', response.data);
            }
            //localStorage.setItem("orderId", orderId);
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    }

    const createOrder = async () => {
        try {
            const data = {
                method: method,
                amount: orderData.totalAmount
            }
            console.log('Payment Data:', data)
            const response = await axios.post(
                `${backendurl}/payment/${orderData.orderId}`,
                data,
                {
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            )
            console.log('Payment order response:', response.data)
            const payment = response.data.results;
            if(method === "VNPAY" && payment.paymentUrl){
                window.location.href = payment.paymentUrl; 
            }else{
                navigate("/view-order/" + response.data.orderId)    
            }
        } catch (error) {
            console.error('Error creating payment order:', error)
        }
    }


    if (!orderData) {
        return <div>Loading...</div>;
    }
    console.log(orderData);
    console.log(method);
    return (
        <div className='border-t py-10'>
            <div className=' flex flex-col gap-2 items-center'>
                {/* <div className='text-8xl '>
                    <BsCheckCircle className='text-green-500'/>
                </div> */}
                <h2 className='text-3xl font-medium'>Order Details</h2>
            </div>
            <div className='flex flex-col gap-5 my-2'>
                <h3 className='text-xl'>Delivery Information</h3>
                <div className='border px-5 pt-3 pb-10 gap-2 flex flex-col'>
                    <p><strong>Full name : </strong>{orderData.fullName} </p>
                    <p><strong>Address : </strong>{orderData.shippingAddress}</p>
                    <p><strong>Phone : </strong>{orderData.phone} </p>
                </div>
                <h3 className='text-xl'>Payment Method</h3>
                <div className='border px-3 py-5 space-y-3'>
                    <label
                        className={`relative flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all duration-200 ${method === "COD"
                            ? "border-red-500 bg-red-50 shadow-sm"
                            : "border-gray-200 hover:border-red-300"
                            }`}
                    >
                        <div className='flex gap-2 items-center'>
                            <input
                                type="radio"
                                name='payment'
                                value="COD"
                                checked={method === "COD"}
                                onChange={() => setMethod("COD")}
                                className="accent-red-600 focus:ring-red-500 w-4 h-4"
                            />
                            <span className="text-xl">📦</span>
                            <span>Cash on delivery</span>
                        </div>
                        {method === "COD" && (
                            <CheckCircleIcon className='text-red-500 absolute right-3 top-3' />
                        )}
                    </label>

                    <label
                        className={`relative flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-all duration-200 ${method === "vnpay"
                            ? "border-red-500 bg-red-50 shadow-sm"
                            : "border-gray-200 hover:border-red-300"
                            }`}
                    >
                        <div className='flex gap-2 items-center'>
                            <input
                                type='radio'
                                name='payment'
                                value="VNPAY"
                                checked={method === "VNPAY"}
                                onChange={() => setMethod("VNPAY")}
                                className="accent-red-600 focus:ring-red-500 w-4 h-4"
                            />
                            <img src={assets.logovnpay} alt="VNPay" className="w-10 h-5 object-contain" />
                            <span>Payment by VNPay</span>
                        </div>
                        {method === "VNPAY" && (
                            <CheckCircleIcon className='text-red-500 absolute right-3 top-3' />
                        )}
                    </label>
                </div>
                <div className='border p-5'>
                    <div className='flex justify-between mb-2'>
                        <p className='text-l'>Temporarily calculated : </p>
                        <p className='text-l font-medium'>{orderData?.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    </div>
                    <div className='flex justify-between mb-2'>
                        <p className='text-l'>Shipping fee : </p>
                        <p className='text-l font-medium'>Free shipping</p>
                    </div>
                    <hr />
                    <div className='flex justify-between mb-2'>
                        <p className='text-l'>Total : </p>
                        <p className='text-l font-medium'>{orderData?.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                    </div>
                </div>
            </div>
            <button  onClick={createOrder}
             className='mt-5 border w-full p-2 rounded-md bg-red-500 text-white text-center'>Payment</button>
        </div>
    )
}

export default OrdersUser