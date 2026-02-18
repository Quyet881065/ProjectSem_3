
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../../context/ShopContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { FaShoppingCart, FaCog, FaTruck, FaUserCheck } from 'react-icons/fa'
import Title from '../../../components/layout/Title'
import { BsCheckCircle } from "react-icons/bs";
import { getToken } from '../../../service/localStorageService'

const ViewOrderDetail = () => {
    const { orderId } = useParams();
    const { backendurl, navigate } = useContext(ShopContext)
    const [viewOrderData, setViewOrderData] = useState([]);
    const getViewOrder = async () => {
        try {
            const response = await axios.get(backendurl + `/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
            if (response.data) {
                setViewOrderData(response.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getViewOrder();
    }, [backendurl])
    console.log(viewOrderData)

    const getStatusStyle = status => {
        return status === "Order received" ? "text-red-500" : "";
    }

    return (
        <div>
            <div className='border-t-2'>
                <div className='text-7xl flex flex-col justify-center items-center my-10'>
                    <BsCheckCircle className='text-green-500' />
                    <h2 className='text-3xl font-medium'>Order Successfully</h2>
                </div>
                <p className='font-medium text-xl'>Order status</p>
                <div className='flex items-center justify-between '>
                    <div className='flex flex-col items-center'>
                        <FaShoppingCart className={`text-3xl ${getStatusStyle(viewOrderData.status)}`} />
                        <p className={`${getStatusStyle(viewOrderData.status)}`}>Order received</p>
                    </div>
                    <div className='flex-grow border-t-2 border-gray-300'></div>
                    <div className='flex flex-col items-center'>
                        <FaCog className={`text-3xl ${viewOrderData.status === "Processing" ? "text-red-500" : ""}`} />
                        <p className={`${viewOrderData.status === "Processing" ? "text-red-500" : ""}`}>Processing</p>
                    </div>
                    <div className='flex-grow border-t-2 border-gray-300'></div>
                    <div className='flex flex-col items-center'>
                        <FaTruck className={`text-3xl ${viewOrderData.status === "Shipping" ? "text-red-500" : ""}`} />
                        <p className={`${viewOrderData.status === "Shipping" ? "text-red-500" : ""}`}>Shipping</p>
                    </div>
                    <div className='flex-grow border-t-2 border-gray-300'></div>
                    <div className='flex flex-col items-center'>
                        <FaUserCheck className={`text-3xl ${viewOrderData.status === "Successful flower delivery" ? "text-red-500" : ""}`} />
                        <p className={`${viewOrderData.status === "Successful flower delivery" ? "text-red-500" : ""}`}>Successful flower delivery</p>
                    </div>
                </div>
                <div className='border border-gray-500 rounded-md my-5 px-7 py-2'>
                    <div className='flex flex-row justify-between text-xl font-medium'>
                        <h3>DH : {viewOrderData.orderId}</h3>
                        <p className='text-blue-500 cursor-pointer'
                            onClick={() => navigate('/orders')} >
                            Order Management
                        </p>
                    </div>
                    <hr className='my-3' />
                    {viewOrderData && (
                        <div>
                            <p><strong>Full name : </strong>{viewOrderData.fullName}</p>
                            <p><strong>Phone : </strong>{viewOrderData.phone}</p>
                            <p><strong>Address : </strong>{viewOrderData.shippingAddress}</p>
                        </div>
                    )}
                    <hr className='my-3' />
                    {viewOrderData.items ? (
                        viewOrderData.items.map((item, index) => (
                            <div className='flex justify-between items-center' key={index}>
                                <div className='flex gap-3 items-center'>
                                    <img src={item.url} alt='' className='w-[60px]' />
                                    <div>
                                        <p>{item.flowerName}</p>
                                        <p>{item.quantity} x <strong className='text-red-500'>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong></p>
                                    </div>
                                </div>
                                <div>
                                    <strong className='text-red-500'>{viewOrderData.totalAmount.toLocaleString('vi-VN', {style:'currency', currency:'VND'})}</strong>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No flowers found for this order.</p>
                    )}

                    <hr className='my-5' />
                    <div className='flex justify-end'>
                        <p className='text-xl font-medium'>Total Amount : <strong className='text-red-500'>{viewOrderData.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</strong></p>
                    </div>
                </div>
            </div>
            <button onClick={() => navigate('/')} className='border w-full py-2 rounded-xl bg-red-500 text-white text-xl'>Continue shopping</button>
        </div>
    )
}

export default ViewOrderDetail