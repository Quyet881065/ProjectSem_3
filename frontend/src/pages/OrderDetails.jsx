
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import Title from '../components/Title';
import { FaShoppingCart, FaCog, FaTruck, FaUserCheck } from 'react-icons/fa'

const OrderDetails = () => {
  const [orderData, setOrderData] = useState([]);
  const { backendurl, navigate } = useContext(ShopContext);
  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const response = await axios.get(backendurl + '/api/OrderDetails')
        if (response.data.success) {
          setOrderData(response.data.orderdata);
        } else {

        }
      } catch (error) {

      }
    }
    getOrderDetail();
  }, [backendurl])
  console.log(orderData);

  const getStatusComponent = (status) => {
    switch (status) {
      case "Order received":
        return (
          <div className='flex flex-col items-center'>
            <FaShoppingCart className='text-red-500 text-3xl' />
            <p className='text-red-500'>Order received</p>
          </div>
        );
      case "Processing":
        return (
          <div className='flex flex-col items-center'>
            <FaCog className='text-red-500 text-3xl' />
            <p className='text-red-500'>Processing</p>
          </div>
        );
      case "Shipping":
        return (
          <div className='flex flex-col items-center'>
            <FaTruck className='text-red-500 text-3xl' />
            <p className='text-red-500'>Shipping</p>
          </div>
        );
      case "Successful delivery":
        return (
          <div className='flex flex-col items-center'>
            <FaUserCheck className='text-red-500 text-3xl' />
            <p className='text-red-500'>Successful flower delivery</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
        <Title text1={"ORDER"} text2={"ALL"} />
      </div>
      {/* <div className='flex items-center justify-between my-8'>
        <div className='flex flex-col items-center'>
          <FaShoppingCart className='text-red-500 text-3xl' />
          <p className='text-red-500'>Order received</p>
        </div>
        <div className='flex-grow border-t-2 border-gray-300'></div>
        <div className='flex flex-col items-center'>
          <FaCog className='text-red-500 text-3xl' />
          <p className='text-red-500'>Processing</p>
        </div>
        <div className='flex-grow border-t-2 border-gray-300'></div>
        <div className='flex flex-col items-center'>
          <FaTruck className='text-red-500 text-3xl' />
          <p className='text-red-500'>Shipping</p>
        </div>
        <div className='flex-grow border-t-2 border-gray-300'></div>
        <div className='flex flex-col items-center'>
          <FaUserCheck className='text-red-500 text-3xl' />
          <p className='text-red-500'>Successful flower delivery</p>
        </div>
      </div> */}
      {orderData.map((item, index) => (
        <div className='my-20'>
          <div className='flex items-center justify-between my-8'>
            {getStatusComponent(item.status)}
          </div>
          <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border border-gray-300 '>
            <p>Flower Name</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Active</p>
          </div>
          <div key={index} className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr] py-5'>
            <div className='flex flex-row gap-5 items-center'>
              <img src={item.flowerImage} alt='' className='w-16 rounded-lg' />
              <p className='text-lg font-bold'>{item.flowerName}</p>
            </div>
            <p className='pt-6'>{item.price}</p>
            <p className='pt-6 pl-3'>{item.quantity}</p>
            <p className='pt-6 text-gray-600 font-bold'>${item.total}</p>
            <div className='flex flex-col gap-2 my-[-10px]'>
              <button onClick={() => navigate(`/vieworder/${item.orderdetailid}`)} className='border bg-blue-500 py-1.5 px-0.5 rounded-md'>View Order Details</button>
              <button className='border bg-red-500 py-1.5 px-1 rounded-md'>Delete Order</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default OrderDetails