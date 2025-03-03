
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
                recipientPhone: item.recipientPhone,
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



  // const deleteFlower = async (orderId, flowerId) => {
  //   try {
  //     const response = await axios.delete(`${backendurl}/api/OrderDetails/${orderId}/${flowerId}`);
  //     if (response.data.success) {
  //       setOrderData(prevOrders =>
  //         prevOrders.map(order =>
  //           order.orderid === orderId
  //             ? {
  //               ...order,
  //               flowers: order.flowers.filter(flower => flower.flowerId !== flowerId),
  //               total: order.total - (order.flowers.find(flower => flower.flowerId === flowerId)?.price || 0) * (order.flowers.find(flower => flower.flowerId === flowerId)?.quantity || 0)
  //             }
  //             : order
  //         )
  //       );
  //     } else {
  //       console.error("Error deleting flower:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete flower", error);
  //   }
  // };

  // const deleteOrder = async (orderId) => {
  //   try {
  //     const response = await axios.delete(backendurl + `/api/Orders/${orderId}`);
  //     if (response.data.success) {
  //       // Cập nhật lại orderData sau khi xóa thành công
  //       setOrderData(prevOrders =>
  //         prevOrders.filter(order => order.orderid !== orderId) // Loại bỏ đơn hàng có orderId khỏi danh sách 
  //       );
  //     }
  //   } catch (error) {

  //   }
  // }

  return (
    <div className='py-5'>
      <div className='text-center text-3xl'>
        <Title text1={"MY"} text2={"ORDER"} />
      </div>
      {orderData.length === 0 ? ( // Kiểm tra nếu orderData rỗng
        <div className='text-center text-xl mt-10'>
          <p>No Orders Found</p>
        </div>
      ) : (
        orderData.map((order, index) => (
          <div key={index} className='border border-gray-300 my-5 p-2'>
            <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr] border-b border-gray-300'>
              <p className='font-medium'>Flower Name</p>
              <p className='font-medium'>Price</p>
              <p className='font-medium'>Quantity</p>
              <p className='font-medium'>Total</p>
              <p className='text-center font-medium'>Actions</p>
            </div>
            {order.flowers.map((item, inx) => (
              <div key={inx} className='my-1'>
                <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr]'>
                  <div className='flex flex-row gap-5 items-center'>
                    <img className='w-16 rounded-lg' src={item.flowerImage} alt='' />
                    <p className='text-lg font-bold'>{item.flowerName}</p>
                  </div>
                  <p className='pt-7'>{item.price}</p>
                  <p className='pt-7'>{item.quantity}</p>
                  <p className='pt-7 text-gray-600 font-bold'>{item.price * item.quantity}</p>
                  <div className='flex flex-col items-center justify-center'>
                    {/* <button onClick={() => deleteFlower(order.orderid, item.flowerId)} className='border bg-red-500 rounded-md px-1'>Delete Flower</button> */}
                <button onClick={() => navigate(`/view-order/${order.orderid}`)} className='border bg-blue-500 py-1.5 px-1 rounded-md'>View Order</button>
                  </div>
                </div>
              </div>
            ))}
            <div className='flex flex-row gap-20 justify-end items-center border-t border-gray-300'>
              <p className='font-bold'>Total Order : ${order.total}</p>
              {/* <button onClick={() => deleteOrder(order.orderid)} className='border bg-red-500 py-1.5 px-1 rounded-md'>Delete Order</button> */}
            </div>
          </div>
        ))
      )}
    </div>
  )
  
}

export default Order