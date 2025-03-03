
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { FaEye, FaEdit } from "react-icons/fa";

const User = () => {
  const [userData, setUserData] = useState([])
  const fetchUser = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/Users');
      setUserData(response.data);
    } catch (error) {

    }
  }
  // const deleteUser = async (userId) => {
  //   try {
  //     const response = await axios.delete(backendUrl + `/api/Users/${userId}`);
  //     if (response.data.success) {
  //       // Handle success, e.g., refetch users or display a success message
  //       console.log('User deleted successfully');
  //       fetchUser();
  //     } else {
  //       // Handle failure, e.g., display an error message
  //       console.log('Failed to delete user');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  useEffect(() => {
    fetchUser();
  }, [])
  console.log(userData)
  return (
    <div>
      <h2 className='font-bold text-xl mb-3'>Account Management</h2>
      <div className='bg-gray-100'>
        <p className='pl-5 font-semibold py-2'>Account List</p>
        <div className='grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_2fr] text-center font-bold border border-gray-300 bg-gray-300'>
          <p>STT</p>
          <p>Full Name</p>
          <p>Email</p>
          <p>Phone</p>
          <p>Account Type</p>
          <p>Operation</p>
        </div>
        {userData.map((item, index) => (
          <div className='grid grid-cols-[0.5fr_2fr_2fr_1fr_1fr_2fr] text-center py-2 ' key={index}>
            <p>{index + 1}</p>
            <p>{item.username}</p>
            <p>{item.email}</p>
            <p>{item.customers?.[0]?.phone}</p>
            <p>{item.role}</p>
            <div className='flex flex-row gap-3 items-center justify-center cursor-pointer'>
              <FaEye className='border bg-black text-white p-2 text-3xl rounded-sm' />
              <FaEdit className='border p-2 text-3xl bg-blue-500 text-white rounded-sm' />
              {/* <button onClick={() => deleteUser(item.userId)} >
                <FaTrash className='border p-2 text-3xl bg-red-500 text-white rounded-sm cursor-pointer' />
              </button> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default User