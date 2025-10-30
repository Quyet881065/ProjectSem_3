
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios';
import Title from '../components/layout/Title';
import { FaShoppingCart, FaCog, FaTruck, FaUserCheck } from 'react-icons/fa'
import { BsCheckCircle } from "react-icons/bs";
import { FaRegCalendarAlt } from "react-icons/fa";
import { getToken } from '../service/localStorageService';

const Order = () => {
  const [orderData, setOrderData] = useState([]);
  const { backendurl, navigate, userId } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Pending', 'Paid', 'Shipping', 'Completed', 'Cancel'];

  useEffect(() => {
    const getPaymentOrderDetail = async () => {
      try {
        const response = await axios.get(backendurl + `/orders/user/${userId}?status=${activeTab}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })
        if (response.data.results) {
          const orders = response.data.results;
          setOrderData(orders);
        } else {

        }
      } catch (error) {

      }
    }
    if (userId) {
      getPaymentOrderDetail();
    }
  }, [userId, activeTab])
  console.log(orderData);

  // loc theo tab dang chon
  const filteredOrders = activeTab === 'All'
   ? orderData 
   : orderData.filter(order => order.statusOrder.toUpperCase() === activeTab.toUpperCase())


  return (
    <div className='border px-5 rounded-md shadow-lg w-full mb-20'>
      <h2 className='text-xl font-semibold mt-2'>My Order</h2>
      <div className='flex flex-row gap-2  my-3 justify-center bg-gray-100 rounded-md max-w-2xl mx-auto py-1'>
        {tabs.map((tab) => (
          <button onClick={() => setActiveTab(tab)} key={tab}
            className={`px-9 overflow-hidden ${activeTab === tab ? "bg-white text-black shadow-sm rounded-md" : "text-gray-600 rounded-md hover:bg-gray-200"}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className=''>
        {filteredOrders.length === 0 ? ( // Kiểm tra nếu orderData rỗng
          <div className='text-center text-xl mt-10'>
            <p>No Orders Found</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className='border rounded-md border-gray-300 my-2 p-3 '>
              <div className='flex justify-around items-center'>
                <div className='flex flex-col gap-2'>
                  <p className=''>Order Code : #{order.orderId?.slice(0, 12) || "####"}</p>
                  <div className='flex items-center gap-2'>
                    <FaRegCalendarAlt />
                    {new Date(order.paidAt).toLocaleString('vi-VN', {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false, // hiển thị 24h, nếu muốn 12h thì để true
                      timeZone: "Asia/Ho_Chi_Minh" // đảm bảo hiển thị đúng giờ VN
                    })}
                  </div>
                </div>
                <div>
                  <div className='flex gap-3 py-3'>
                    <p>Payment Method : </p>
                    <span>{order.method === "VNPAY" ? "Payment VNPay" : order.method === "COD" ? "Cash on delivery" : order.method}</span>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium
                      ${order.statusPayment === "COMPLETED" ? "bg-green-100 text-green-800"
                        : order.statusPayment === "PENDING" ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-700"}`}>
                            {order.statusPayment === "COMPLETED" ? "Completed" 
                             : order.statusPayment === "PENDING" ? "Pending"
                               : "Failed"}
                    </span>
                  </div>
                  <div className='flex gap-3'>
                    <p>Status order :  </p>
                    <span className={`inline-block px-3 py-1 rounded-md text-sm font-medium
                    ${order.statusOrder === "PAID" ? "bg-green-100 text-green-800"
                        : order.statusOrder === "PENDING" ? "bg-yellow-100 text-yellow-800"
                          : order.statusOrder === "SHIPPING" ? "bg-blue-100 text-blue-800"
                            : order.statusOrder === "CANCELLED" ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-700"}`}>

                      {order.statusOrder === "PENDING" ? "Pending"
                        : order.statusOrder === "PAID" ? "Paid"
                          : order.statusOrder === "SHIPPING" ? "Shipping"
                            : order.statusOrder === "CANCELLED" ? "Cancelled"
                              : order.statusOrder}
                    </span>
                  </div>
                </div>
              </div>
              <hr className='my-5' />
              <div className='flex'>
                <div className='flex flex-col'>
                  <h3 className='py-3'>Flower products</h3>
                  {order.flowers && order.flowers.length > 0 ? (
                    order.flowers.map((item, index) => (
                      <div key={index} className='flex gap-3 '>
                        <img src={item.url} alt='' className='w-[50px]' />
                        <div className='flex flex-col gap-0.95'>
                          <p>{item.flowerName}</p>
                          <p className='pt-0.5'>Quantity : {item.quantity}</p>
                          <p></p>
                        </div>
                        <div className='flex flex-col justify-center'>
                          <p className='text-red-500 font-medium'>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                        </div>
                      </div>
                    ))
                  ) : "No flowers found for this order."}
                </div>
              </div>
              <hr className='my-5'/>
              <div className='flex justify-end gap-3'>
                <p className='text-lg font-medium'>Total : </p>
                <span className='text-xl font-semibold text-red-500'>{order.totalAmount.toLocaleString('vi-VN', {style:"currency", currency:"VND"})}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

}

export default Order