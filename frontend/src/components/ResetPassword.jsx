
import axios from 'axios';
import React, { useContext } from 'react'
import { useState } from 'react';
import { ShopContext } from '../context/ShopContext';

const ResetPassword = () => {
  const {backendurl} = useContext(ShopContext);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e =>{
    e.preventDefault();
    setMessage('')
    setEmail('')
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    try {
      const response = await axios.post(backendurl + '/api/Auth/forgot-password', {email, newPassword, confirmPassword})
      if (response.data.success) {
        setMessage('Cập nhật mật khẩu thành công.');
      } else {
        setError(response.data.message || 'Đã xảy ra lỗi.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu.');
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-3xl font-medium mt-10'>Reset Password</h2>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 mt-10 w-[30%]'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center'>
          <label className='w-32'>Email:</label>
          <input className='border border-gray-800 w-full py-1'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center'>
          <label className='w-32'>New Password:</label>
          <input className='border border-gray-800 w-full py-1'
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className='flex flex-col sm:flex-row items-start sm:items-center'>
          <label className='w-32'>Confirm Password:</label>
          <input className='border border-gray-800 w-full py-1'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {message && <div className='text-green-500'>{message}</div>}
        {error && <div className='text-red-500'>{error}</div>}
        <button className='bg-blue-500 w-40 m-auto py-2 rounded-md' type="submit">Reset Password</button>
      </form>
    </div>
  )
}

export default ResetPassword