
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext';

const RequestChangePassWord = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const {backendurl} = useContext(ShopContext);
    const handleSubmit = async e =>{
         e.preventDefault();
         setMessage('');
         setError('');
         try {
            const response = await axios.post(backendurl + '/api/Auth/request-change-password', {email});
            if(response.data.success){
              setMessage(response.data.message);
            }else{
              setError(response.data.message);
            }
         } catch (error) {
           setError('Failed to send reset link. Please try again later.');
         }
    }
  return (
    <div className='flex flex-col items-center gap-10'>
        <h2 className='mt-10 text-2xl font-medium'>Request Change Password</h2>
        <form onSubmit={handleSubmit}>
            <div className='flex flex-row gap-5'>
                <label>Email :</label>
                <input className='border border-gray-800' type='email' onChange={e=> setEmail(e.target.value)} value={email} />
            </div>
            <button className='bg-black mt-10 text-white px-3 py-2 text-sm rounded-sm ml-10' type='submit'>Send Reset Link</button>
        </form>
        {message && <p className='text-green-500 mt-5'>{message}</p>}
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}

export default RequestChangePassWord