
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [current, setCurrent] = useState('Login');
  const { backendurl, token, setToken, navigate , getUserCart } = useContext(ShopContext);
  const [message, setMessage] = useState({ success: '', error: '' });
  const [formData, setformData] = useState({
    email: '',
    password: '',
    fullName: '',
    gender: '',
    phone: '',
    address: '',
  })

  const handleSubmit = e => {
    const { name, value } = e.target;
    setformData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        email: formData.email,
        password: formData.password
      };
      if (current === "Sign Up") {
        // Nếu là đăng ký, thêm các trường khác
        dataToSend.fullName = formData.fullName;
        dataToSend.gender = formData.gender;
        dataToSend.phone = formData.phone;
        dataToSend.address = formData.address;
        const response = await axios.post(backendurl + '/api/Auth/register', dataToSend);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setMessage({ success: "Registration successful! Redirecting to Login...", error: '' });
          setTimeout(() => {
            setCurrent("Login");
            setformData({email:'', password:''})
          }, 2000);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendurl + '/api/Auth/login', dataToSend);
        if (response.data.success) {
          const { token, userId, customerId } = response.data;
          setToken(token);
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('customerId', customerId ?? "null");
          console.log(response.data.customerId);
          console.log("CustomerID:", customerId);
          console.log(response.data.message)
          await getUserCart();
          navigate('/')
        } else {
          //toast.error(response.data.message);
          setMessage(response.data.message);
          console.log(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      //toast.error(error.message)
      setMessage(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto text-gray-800 gap-4 border-t my-5'>
      <div className='inline-flex items-center gap-2  mb-2'>
        <p className='prata-regular text-3xl'>{current}</p>
        <hr className='border-none h-[1.5px] bg-gray-700 w-8' />
      </div>
      <div className='flex flex-row gap-5'>
        {current === 'Login' ? '' : <input onChange={handleSubmit} name='fullName' value={formData.fullName} className='border border-gray-800  px-3 py-2' type='text' placeholder='FullName' />}
        {current === 'Login' ? '' :
          <select onChange={handleSubmit} name='gender' value={formData.gender} className='border border-gray-300 px-2'>
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Female">Female</option>
            <option value="Other Options">Other Options</option>
          </select>
        }
      </div>
      {current === 'Login' ? '' : <input onChange={handleSubmit} name='phone' value={formData.phone} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='Phone' />}
      {current === 'Login' ? '' : <input onChange={handleSubmit} name='address' value={formData.address} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='Address' />}
      <input onChange={handleSubmit} name='email' value={formData.email} className='w-full border border-gray-800 px-3 py-2' type='email' placeholder='Email' />
      <input onChange={handleSubmit} name='password' value={formData.password} className='w-full border border-gray-800 px-3 py-2' type='password' placeholder='Password' />
      <div className='w-full flex  justify-between text-sm mt-[-8px] '>
        <p onClick={() => navigate('/change-password')} className='cursor-pointer'>Forgot your password</p>
        {
          current === "Login"
            ? <p onClick={() => setCurrent('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrent('Login')} className='cursor-pointer'>Login here</p>
        }
      </div>
      {message.error && <p className='text-red-500'>{message.error}</p>}
      {message.success && <p className='text-green-500'>{message.success}</p>}
      <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-3'>
        {current === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  )
}

export default Login