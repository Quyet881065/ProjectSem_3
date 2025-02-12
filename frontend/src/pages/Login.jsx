
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [current, setCurrent] = useState('Login');
  const { backendurl, token, setToken, navigate } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userName", name);
      formData.append("email", email);
      formData.append("password", password);
      if (current === "Sign Up") {
        formData.append('fullName', fullName);
        formData.append('gender', gender);
        formData.append('phone', phone);
        formData.append('address', address);
        const response = await axios.post(backendurl + '/api/Auth/register', formData);
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setSuccess("Registration successful! Redirecting to Login...");
          setTimeout(() => {
            setCurrent("Login");
            setSuccess('');
            setEmail('');
            setPassword('');
          }, 2000);
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendurl + '/api/Auth/login', { email, password });
        if (response.data.success) {
          const { token, userId, role, customerId } = response.data;
          setToken(token);
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userId);
          localStorage.setItem('role', role);
          localStorage.setItem('customerId', customerId ?? "null");
          console.log(response.data.customerId);
          console.log("CustomerID:", customerId);
          if (role === "admin") {
            navigate("/admin")
            console.log(role)
          } else {
            navigate('/');
          }
          console.log(response.data.message)
          console.log(response.data.role);
        } else {
          //toast.error(response.data.message);
          setError(response.data.message);
          console.log(response.data.message)
        }
      }
    } catch (error) {
      console.log(error)
      //toast.error(error.message)
      setError(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto text-gray-800 mt-8 gap-4'>
      <div className='inline-flex items-center gap-2 mt-10 mb-2'>
        <p className='prata-regular text-3xl'>{current}</p>
        <hr className='border-none h-[1.5px] bg-gray-700 w-8' />
      </div>
      {current === 'Login' ? '' : <input onChange={e => setName(e.target.value)} value={name} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='Name' />}
      {current === 'Login' ? '' : <input onChange={e => setFullName(e.target.value)} value={fullName} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='FullName' />}
      {current === 'Login' ? '' : <input onChange={e => setGender(e.target.value)} value={gender} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='Gender' />}
      {current === 'Login' ? '' : <input onChange={e => setPhone(e.target.value)} value={phone} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='Phone' />}
      {current === 'Login' ? '' : <input onChange={e => setAddress(e.target.value)} value={address} className='border border-gray-800 w-full px-3 py-2' type='text' placeholder='Address' />}
      <input onChange={e => setEmail(e.target.value)} value={email} className='w-full border border-gray-800 px-3 py-2' type='email' placeholder='Email' />
      <input onChange={e => setPassword(e.target.value)} value={password} className='w-full border border-gray-800 px-3 py-2' type='password' placeholder='Password' />
      <div className='w-full flex  justify-between text-sm mt-[-8px] '>
        <p onClick={() => navigate('/change-password')} className='cursor-pointer'>Forgot your password</p>
        {
          current === "Login"
            ? <p onClick={() => setCurrent('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrent('Login')} className='cursor-pointer'>Login here</p>
        }
      </div>
      {error && <p className='text-red-500'>{error}</p>}
      {success && <p className='text-green-500'>{success}</p>}
      <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-3'>{current === "Login" ? "Sign In" : "Sign Up"}</button>
    </form>
  )
}

export default Login