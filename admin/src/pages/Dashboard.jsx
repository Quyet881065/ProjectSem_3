
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { BsPersonFill, BsCart, BsBoxSeam } from "react-icons/bs";
import { getToken } from '../service/localStorageService';
import { ShopContext } from '../context/ShopContext';

const Dashboard = () => {
  const {backendurl} = useContext(ShopContext)
  const [totalOrder, setTotalOrder] = useState(0);
  const [totalFlower, setTotalFlower] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  console.log(getToken());

  const fetchTotalOrder = async () => {
    try {
      const response = await axios.get(backendurl + '/orders/total',{
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
      if (response.data.message === "success") {
        setTotalOrder(response.data.results);
      }
    } catch (error) {

    }
  }

  const fetchTotalProduct = async () => {
    try {
      const response = await axios.get(backendurl + '/flowers/total');
      if (response.data.message === "success") {
        setTotalFlower(response.data.results)
      }
    } catch (error) {

    }
  }

  const fetchTotalUser = async () => {
    try {
      const response = await axios.get(backendurl + '/users/total', {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      if (response.data.message === "success") {
        setTotalUser(response.data.results)
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