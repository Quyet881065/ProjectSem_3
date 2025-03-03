
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BsPersonFill, BsCart, BsBoxSeam } from "react-icons/bs";
import { backendUrl } from '../App';

const Dashboard = () => {
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalFlower, setTotalFlower] = useState(0);
  const [totalUser, setTotalUser] = useState(0);

  const fetchTotalOrder = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/Orders/TotalOrders')
      if (response.data.success) {
        setTotalOrder(response.data.totalOrders);
      }
    } catch (error) {

    }
  }

  const fetchTotalProduct = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/Flowers/TotalFlower');
      if (response.data.success) {
        setTotalFlower(response.data.totalFlower)
      }
    } catch (error) {

    }
  }

  const fetchTotalUser = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/Users/TotalUser');
      if (response.data.success) {
        setTotalUser(response.data.total)
      }
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchTotalOrder();
    fetchTotalProduct();
    fetchTotalUser();
  }, [])

  return (
    <div className='flex flex-col '>
      <p className='text-2xl font-medium mb-10'>Statistics Page</p>
      <div className='flex justify-around'>
        <div className='flex flex-row gap-7 items-center px-7 py-2 border rounded-md bg-blue-500'>
          <BsPersonFill className='text-3xl text-white' />
          <div>
            <p className='font-medium text-white'>Total Uses</p>
            <p className='text-black font-bold text-xl'>{totalUser}</p>
          </div>
        </div>
        <div className='flex flex-row gap-7 items-center px-7 border rounded-md bg-purple-500'>
          <BsCart className='text-3xl text-white' />
          <div>
            <p className='font-medium text-white'>Total Orders</p>
            <p className='text-black font-bold text-xl'>{totalOrder}</p>
          </div>
        </div>
        <div className='flex flex-row gap-7 items-center px-7 border rounded-md bg-green-500'>
          <BsBoxSeam className='text-3xl text-white' />
          <div>
            <p className='font-medium text-white'>Total Flowers</p>
            <p className='text-black font-bold text-xl'>{totalFlower}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard