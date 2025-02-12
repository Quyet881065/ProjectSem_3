
import React, { useState } from 'react'
import { backendUrl } from '../App'
import axios from 'axios';

const Login = ({setToken}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + '/api/Auth/login/admin', { email, password })
      if(response.data.success){
         setToken(response.data.token)
         console.log(response.data.message)
      }else{
        console.log(response.data.message)
      }
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg max-w-md px-8 py-6'>
        <h1 className='text-2xl font-bold mb-5'>Admin Panel</h1>
        <form onSubmit={onSubmitHandle}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input onChange={e => setEmail(e.target.value)} value={email} className='border border-gray-300 rounded-md w-full outline-none px-3 py-2' type='email' placeholder='Email' />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input onChange={e => setPassword(e.target.value)} value={password} className='border border-gray-300 rounded-md w-full px-3 py-2' type='password' placeholder='Password' />
          </div>
          <button className='mt-2 bg-black text-white px-5 py-2 w-full rounded-md' type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login