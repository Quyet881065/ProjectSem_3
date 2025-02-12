
import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { ShopContext } from '../../context/ShopContext'

const Navbar = () => {
    const {navigate} = useContext(ShopContext);
    const handleLogout = ()=>{
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    }
  return (
    <div className='flex items-center justify-between py-2 px-[5%]'>
        <img src={assets.logo} alt='' className='w-20'/>
        <button onClick={handleLogout} className='bg-gray-500 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar