
import React from 'react'
import { assets } from '../assets/assets.'
import { useNavigate } from 'react-router-dom'

const Navbar = ({setToken}) => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-between py-2 px-[3%]'>
        <img onClick={()=> navigate('/')} className='w-[max(5%,50px)] cursor-pointer' src={assets.logo} alt=''/>
        <button onClick={() => setToken('')} className='bg-gray-500 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar