
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import Title from '../components/Title';
import { FaShoppingCart, FaCog, FaTruck, FaUserCheck } from 'react-icons/fa'

const Order = () => {
  const [orderData, setOrderData] = useState([]);
  const { backendurl, navigate } = useContext(ShopContext);
  useEffect(() => {
    const customerId = localStorage.getItem('customerId')
    const getOrderDetail = async () => {
      try {
        const response = await axios.get(backendurl + `/api/OrderDetails/customer/${customerId}`)
        if (response.data.success) {
          const orders = response.data.orderdata;
          const orderMap = new Map();
          orders.forEach(item => {
            if (!orderMap.has(item.orderid)) {
              orderMap.set(item.orderid, {
                orderid: item.orderid,
                total: item.total,
                deliveryAddress: item.deliveryAddress,
                status: item.status,
                recipientPhone : item.recipientPhone,
                flowers: [],
              })
            }
            orderMap.get(item.orderid).flowers.push(item)
          })
          setOrderData([...orderMap.values()])
        } else {

        }
      } catch (error) {

      }
    }
    getOrderDetail();
  }, [backendurl])
  console.log(orderData);

  const getStatusStyle = status => {
    return status === "Order received" ? "text-red-500" : "";
  }

  return (
    <div>
      <div>
        <Title text1={"ORDER"} text2={"ALL"} />
      </div>
      {orderData.map((order, index) => (
        <div key={index} className='border border-gray-300 my-5 p-5'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-bold'>Order </h3>
            <div className='flex items-center justify-between my-8 min-w-[500px]'>
              <div className='flex flex-col items-center'>
                <FaShoppingCart className={`text-3xl ${getStatusStyle(order.status)}`} />
                <p className={`${getStatusStyle(order.status)} text-sm`}>Order received</p>
              </div>
              <div className='flex-grow border-t-2 border-gray-300'></div>
              <div className='flex flex-col items-center'>
                <FaCog className={`text-3xl ${order.status === "Processing" ? "text-red-500" : ""}`} />
                <p className={`${order.status === "Processing" ? "text-red-500" : ""} text-sm`}>Processing</p>
              </div>
              <div className='flex-grow border-t-2 border-gray-300'></div>
              <div className='flex flex-col items-center'>
                <FaTruck className={`text-3xl ${order.status === "Shipping" ? "text-red-500" : ""}`} />
                <p className={`${order.status === "Shipping" ? "text-red-500" : ""} text-sm`}>Shipping</p>
              </div>
              <div className='flex-grow border-t-2 border-gray-300'></div>
              <div className='flex flex-col items-center'>
                <FaUserCheck className={`text-3xl ${order.status === "Successful flower delivery" ? "text-red-500" : ""}`} />
                <p className={`${order.status === "Successful flower delivery" ? "text-red-500" : ""} text-sm`}>Successful flower delivery</p>
              </div>
            </div>
            <div>
              <p className='text-sm'>Phone : {order.recipientPhone}</p>
              <p className='text-sm'>Delivery Address : {order.deliveryAddress}</p>
            </div>
          </div>
          <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-t border-gray-300 mt-2'>
            <p className='font-medium'>Flower Name</p>
            <p className='font-medium'>Price</p>
            <p className='font-medium'>Quantity</p>
            <p className='font-medium'>Total</p>
            <p className='text-center font-medium'>Actions</p>
          </div>
          {order.flowers.map((item, inx) => (
            <div key={inx} className='my-2'>
              <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr]'>
                <div className='flex flex-row gap-5 items-center'>
                  <img className='w-16 rounded-lg' src={item.flowerImage} alt='' />
                  <p className='text-lg font-bold'>{item.flowerName}</p>
                </div>
                <p className='pt-7'>{item.price}</p>
                <p className='pt-7'>{item.quantity}</p>
                <p className='pt-7 text-gray-600 font-bold'>{item.price * item.quantity}</p>
                <div className='flex flex-col items-center justify-center'>
                  <button className='border bg-red-500 rounded-md px-1 py-1'>Delete Flower</button>
                </div>
              </div>
            </div>
          ))}
          <div className='flex flex-row gap-20 justify-end items-center border-t border-gray-300'>
            <p className='font-bold'>Total Order : ${order.total}</p>
            <button className='border bg-red-500 py-1.5 px-1 rounded-md'>Delete Order</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Order