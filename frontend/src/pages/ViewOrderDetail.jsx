
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { FaShoppingCart, FaCog, FaTruck, FaUserCheck } from 'react-icons/fa'
import Title from '../components/Title'

const ViewOrderDetail = () => {
    const { orderDetailId } = useParams();
    const { backendurl } = useContext(ShopContext)
    const [viewOrderData, setViewOrderData] = useState([]);
    const getViewOrder = async () => {
        try {
            const response = await axios.get(backendurl + `/api/OrderDetails/${orderDetailId}`)
            if (response.data.success) {
                setViewOrderData(response.data.data)
            }
        } catch (error) {

        }
    }
    useEffect(() => {
        getViewOrder();
    }, [backendurl, orderDetailId])
    console.log(viewOrderData)

    const getStatusStyle = status => {
        return status === "Order received" ? "text-red-500" : "";
    }

    return (
        <div>
            <div className='border-t-2'>
                <div className='text-3xl my-10 font-medium text-center'>
                    <Title text1={"ORDER"} text2={"INFORMATION"} />
                </div>
                <p className='font-medium text-xl'>Order status</p>
                <div className='flex items-center justify-between my-8'>
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
                <div className='border border-gray-500 rounded-md my-20 px-2 py-2'>
                    <div className='text-xl font-medium'>
                        <Title text1={"Recipient"} text2={"Information"} />
                    </div>
                    <div className='flex flex-row justify-between'>
                        <p>Recipient name : {viewOrderData.recipientName}</p>
                        <p>Phone : {viewOrderData.recipientPhone}</p>
                        <p>Address : {viewOrderData.address}</p>
                        <p>Payment method : {viewOrderData.paymentMethod}</p>
                    </div>
                </div>
                <div className='border border-gray-500 rounded-md my-20 px-2 py-2'>
                    <div className='text-xl font-medium'>
                        <Title text1={"Order"} text2={"Detail"} />
                    </div>
                    <div className='grid grid-cols-[2fr_1fr_1fr_2fr] bg-gray-500 px-1 py-1 text-white rounded-lg'>
                        <p className='text-center'>Flower Name </p>
                        <p className='text-center'>Price</p>
                        <p className='text-center'>Quantity</p>
                        <p className='text-center'>Message</p>
                    </div>
                    <div className='grid grid-cols-[2fr_1fr_1fr_2fr] items-center'>
                        <div className='flex flex-row gap-10 items-center'>
                            <img className='w-16 rounded-md mt-3' src={viewOrderData.flowerImage} alt='' />
                            <p>{viewOrderData.flowerName}</p>
                        </div>
                        <p className='text-center'>{viewOrderData.price}</p>
                        <p className='text-center'>{viewOrderData.quantity}</p>
                        <p className='text-center'>{viewOrderData.message}</p>
                    </div>
                    <hr className='my-5'/>
                    <div className='flex justify-end'>
                        <p className='text-red-500 text-lg font-medium'>Total : $ {viewOrderData.total}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewOrderDetail