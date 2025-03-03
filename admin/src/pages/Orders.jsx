
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const navigate = useNavigate();
  const fetchOrdersData = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/Orders');
      if (response.data.success) {
        setOrdersData(response.data.data);
      } else {

      }
    } catch (error) {

    }
  }
  // fetchOrdersData();
  useEffect(() => {
    fetchOrdersData()
  }, [])

  const deleteOrder = async(orderId)=>{
    try {
      const response = await axios.delete(backendUrl + `/api/Orders/${orderId}`)
      if(response.data.success){
        fetchOrdersData()
      }
    } catch (error) {
      
    }
  }

  // const handleViewOrder = (orderId) => {
  //   navigate(`/orders/${orderId}`)
  // }

  const handleUpdateStatus = async (orderId) => {
    const newStatus = statusMap[orderId]; // Lay trang thai moi cho order tu statusMap
    if (!newStatus) {
      alert('Please select a status.');
      return;
    }
    try {
      const response = await axios.put(backendUrl + `/api/Orders/${orderId}/status`, { status: newStatus })
      if (response.data.success) {
        fetchOrdersData();
        // alert('Status updated successfully!')
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      alert('Error while updating status');
    }
  }
  // Xu ly thay doi trang thai cho mot order cu the
  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap(prevStatus => ({
      ...prevStatus,
      [orderId]: newStatus, // Cap nhat trang thai cho order co orderId tuong ung
    }))
  }

  console.log(ordersData)
  return (
    <div>
      <p className='text-center text-3xl font-semibold pb-5'>Orders All</p>
      <div>
        <input type='text' placeholder='Enter Name'/>
      </div>
      <div className='mt-5'>
        <div className='grid grid-cols-[0.5fr_1.5fr_1fr_2fr_2fr_1fr_1.5fr_1fr_3fr] font-medium'>
          <p>STT</p>
          <p className='text-center'>Name</p>
          <p className='text-center'>Phone</p>
          <p className='text-center'>Address</p>
          <p>Time Order</p>
          <p className='text-center'>Total</p>
          <p className='text-center'>Status Order</p>
          <p className='text-center'>Payment Method</p>
          <p className='text-center'>Active</p>
        </div>
        {ordersData.map((item, index) => (
          <div key={index} className='grid grid-cols-[0.5fr_1.5fr_1fr_2fr_2fr_1fr_1.5fr_1fr_3fr] border border-gray-200 pl-2'>
            <p className='text-center'>{index + 1}</p>
            <p className='text-center'>{item.deliveryInfo.recipientName}</p>
            <p className=' text-center'>{item.deliveryInfo.recipientPhoneNo}</p>
            <p className='text-center'>{item.deliveryAddress}</p>
            <p>{item.orderDate}</p>
            <p className=' text-center'>{item.total}</p>
            <p className=' text-center'>{item.paymentInfo.paymentMethod}</p>
            <p className=''>{item.status}</p>
            <div className='flex flex-row justify-center gap-2 '>
              <div className=''>
                <select value={statusMap[item.orderId]}
                  onChange={e => handleStatusChange(item.orderId, e.target.value)} // Cap nhat trang thai moi
                  className='border py-1 rounded-md w-20 text-xs'>
                  <option>Select Status</option>
                  <option value='Order received'>Order received</option>
                  <option value='Processing'>Processing</option>
                  <option value='Shipping'>Shipping</option>
                  <option value='Successful flower delivery'>Successful flower delivery</option>
                </select>
              </div>
              <button onClick={() => handleUpdateStatus(item.orderId)} className='border py-1  bg-blue-500 text-white rounded-md cursor-pointer text-sm'>Upload Status Order</button>
              {/* <button onClick={() => handleViewOrder(item.orderId)} className='border px-1 py-1 bg-blue-500 text-white rounded-md cursor-pointer text-sm'>View Order</button> */}
              <button onClick={()=> deleteOrder(item.orderId)} className='border px-1 py-1 bg-red-500 text-white rounded-md cursor-pointer text-sm'>Delete Order</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders