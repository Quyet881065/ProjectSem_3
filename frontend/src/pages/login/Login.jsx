import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';
import { getToken } from '../../service/localStorageService';
import GoogleIcon from "@mui/icons-material/Google";
import { OAuthConfig } from '../../configuration/configuration';
import { setToken } from '../../service/localStorageService';
import { logIn, isAuthenticated } from '../../service/authenticationService';
import { register } from '../../service/userService';
import { data } from 'react-router-dom';

const Login = () => {
  const [current, setCurrent] = useState('Login');
  const { backendurl, navigate, getUserCart } = useContext(ShopContext);
  const [message, setMessage] = useState({ success: '', error: '' });
  const [formData, setformData] = useState({
    username: '',
    password: '',
  })

  const handleClick = () => {
    const callBackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callBackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
    console.log(targetUrl);
    window.location.href = targetUrl;
  }

  const handleSubmit = e => {
    const { name, value } = e.target;
    setformData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const accessToken = getToken();
    if (accessToken)
      navigate("/")
  }, [navigate])

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        username: formData.username,
        password: formData.password
      };
      if (current === "Sign Up") {
        // Nếu là đăng ký, thêm các trường khác
        dataToSend.fullname = formData.fullname;
        dataToSend.email = formData.email;
        const response = await register(dataToSend);
        console.log("Response body:", response);
        if (response.data) {
          setTimeout(() => {
            setCurrent("Login");
            setformData({ username: '', password: '' })
          }, 2000);
        } else {
          toast.error(response.data);
        }
      } else {
        try {
          const response = await logIn(formData.username, formData.password);
          console.log("Response body:", response);
          navigate("/");
        } catch (error) {
          console.error("Login error:", error);
        }
      }
    } catch (error) {
      console.log(error)
      //toast.error(error.message)
      setMessage(error.message)
    }
  }
  console.log("formData", formData);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-[420px] m-auto text-gray-800 gap-4 border-t my-5'>
      <div className='inline-flex items-center gap-2  mb-2'>
        <p className='prata-regular text-3xl'>{current}</p>
        <hr className='border-none h-[1.5px] bg-gray-700 w-8' />
      </div>
      <div className='flex gap-2'>
        {current === 'Login' ? '' : <input onChange={handleSubmit} name='fullname' value={formData.fullname} className='border border-gray-800  px-3 py-2' type='text' placeholder='Full Name' />}
        {current === 'Login' ? '' : <input onChange={handleSubmit} name='email' value={formData.email} className='border border-gray-800  px-3 py-2' type='text' placeholder='Email' />}
      </div>
      <input onChange={handleSubmit} name='username' value={formData.username} className='w-full border border-gray-800 px-3 py-2' type='text' placeholder='User Name' />
      <input onChange={handleSubmit} name='password' value={formData.password} className='w-full border border-gray-800 px-3 py-2' type='password' placeholder='Pass Word' />
      <div className='w-full flex  justify-between text-sm mt-[-8px] '>
        <p onClick={() => navigate('/change-password')} className='cursor-pointer'>Forgot your password</p>
        {
          current === "Login"
            ? <p onClick={() => setCurrent('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setCurrent('Login')} className='cursor-pointer'>Login here</p>
        }
      </div>
      <div className='flex items-center justify-center border px-5 py-2 rounded-lg'>
        <button onClick={handleClick}>
          <GoogleIcon /> Continue with Google
        </button>
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