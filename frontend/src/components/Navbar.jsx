import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { ShopContext } from '../context/ShopContext.jsx'

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const { setShowSearch, navigate, token, setCartData, setToken , cartCount} = useContext(ShopContext);
    const logout = () => {
        navigate('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setCartData([]);
        setToken('');
    }
    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to='/'>
                <img className='w-20' src={assets.logo} alt='' />
            </Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>
                <NavLink to='/wedding-flowers' className='flex flex-col items-center gap-1 '>
                    <p>WEDDING FLOWERS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden ' />
                </NavLink>
                <NavLink to='/opening-flowers' className='flex flex-col items-center gap-1 '>
                    <p>OPENING FLOWERS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/birthday-flowers' className='flex flex-col items-center gap-1'>
                    <p>BIRTHDAY FLOWERS</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} className='w-5 cursor-pointer' src={assets.search_icon} alt='' />
                {/* Sử dụng onClick={() => setShowSearch(true)} để đảm bảo hàm chỉ được gọi khi sự kiện onClick xảy ra. */}
                <div className='group relative'>
                    <img className='w-5 cursor-pointer min-w-5' onClick={() => navigate('/login')} src={assets.profile_icon} alt='' />
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4 w-40'>
                            <div className='flex flex-col gap-2 bg-slate-200 px-5 py-3 text-gray-500 rounded w-full'>
                                <p className='cursor-pointer hover:text-black text-center'>My Profile</p>
                                <p onClick={() => navigate('/orders')}
                                    className='cursor-pointer hover:text-black text-center'>Orders</p>
                                <p onClick={()=> navigate('/changepassword')} className='cursor-pointer hover:text-black text-center whitespace-nowrap'>Change Password</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black text-center'>Logout</p>
                            </div>
                        </div>
                    }
                </div>
                <Link className='relative' to="/cart">
                    <img src={assets.cart_icon} className='w-5 min-w-5 cursor-pointer' />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white rounded-full aspect-square text-[8px]'>{cartCount}</p>
                    {/* leading-4: Thiết lập khoảng cách dòng (line-height) là 1rem (4 * 0.25rem = 1rem)
               aspect-square: Giữ tỷ lệ giữa chiều rộng và chiều cao của phần tử là 1:1, tạo ra hình vuông (hoặc hình tròn khi sử dụng với rounded-full). */}
                </Link>
                <img onClick={() => setVisible(true)} src={assets.menu_icon} alt='' className='w-5 cursor-pointer sm:hidden' />
            </div>
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt='' />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
                    <NavLink className='py-2 pl-6 border' to='/wedding-flowers'>WEDDING FLOWERS</NavLink>
                    <NavLink className='py-2 pl-6 border' to='/opening-flowers'>OPENING FLOWERS</NavLink>
                    <NavLink className='py-2 pl-6 border' to='/birthday-flowers'>BIRTHDAY FLOWERS</NavLink>
                    <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar