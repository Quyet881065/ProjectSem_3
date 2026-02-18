import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../../context/ShopContext';
import { toast } from 'react-toastify';
import GoogleIcon from "@mui/icons-material/Google";
import { OAuthConfig } from '../../../configuration/configuration';
import { logIn, isAuthenticated } from '../service/authenticationService';
import { register } from '../../../service/userService';
import { data, useNavigate } from 'react-router-dom';

const Login = () => {
  const [mode, setMode] = useState('Login');
  const { setUserId } = useContext(ShopContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState({ success: '', error: '' });
  const [formData, setformData] = useState({
    username: '',
    email: '',
    password: '',
    fullname: ''
  })

  // useEffect(() => {
  //   const token = getToken();
  //   if (token)
  //     navigate("/")
  // }, [])

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

  // Ham xu ly thay doi input
  const handleChange = e => {
    const { name, value } = e.target;
    setformData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setMessage({ success: '', error: '' });

    try {
      // 👉 LOGIN
      if (mode === "Login") {

        if (!formData.email || !formData.password) {
          setMessage({ error: "Vui lòng nhập email và mật khẩu!" });
          return;
        }

        const response = await logIn(formData.email, formData.password);
        const data = response.data;

        if (data.statusCode === 200 && data.results?.token) {
          setUserId(data.results.userId);
          toast.success(data.message);
          setTimeout(() => navigate("/"), 300);
        } else {
          setMessage({ error: data.message });
        }
      }

      // 👉 SIGN UP
      else {
        if (!formData.email || !formData.password || !formData.username || !formData.fullname) {
          setMessage({ error: "Vui lòng nhập đầy đủ thông tin đăng ký!" });
          return;
        }

        const response = await register(formData);
        const data = response.data;

        if (data.statusCode === 400 && data.errorCode === "USER_EXISTS") {
          setMessage({ error: data.message });
          return;
        }

        if (data.statusCode === 201) {
          setMessage({ success: data.message });
          setformData({ username: '', email: '', password: '', fullname: '' });
          setMode("Login");
        }
      }

    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi, vui lòng thử lại!";
      setMessage({ error: errMsg });
    }
  };

  console.log("formData", formData);

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-[420px] m-auto text-gray-800 gap-4 border-t my-5'>
      <div className='inline-flex items-center gap-2  mb-2'>
        <p className='prata-regular text-3xl'>{mode}</p>
        <hr className='border-none h-[1.5px] bg-gray-700 w-8' />
      </div>
      <div className='flex gap-2'>
        {mode === 'Login' ? '' : <input onChange={handleChange} name='fullname' value={formData.fullname} className='border border-gray-800  px-3 py-2' type='text' placeholder='Full Name' />}
        {mode === 'Login' ? '' : <input onChange={handleChange} name='username' value={formData.username} className='border border-gray-800  px-3 py-2' type='text' placeholder='User Name' />}
      </div>
      <input onChange={handleChange} name='email' value={formData.email} className='w-full border border-gray-800 px-3 py-2' type='text' placeholder='Email' />
      <input onChange={handleChange} name='password' value={formData.password} className='w-full border border-gray-800 px-3 py-2' type='password' placeholder='Pass Word' />
      <div className='w-full flex  justify-between text-sm mt-[-8px] '>
        <p onClick={() => navigate('/change-password')} className='cursor-pointer'>Forgot your password</p>
        {
          mode === "Login"
            ? <p onClick={() => setMode('Sign Up')} className='cursor-pointer'>Create account</p>
            : <p onClick={() => setMode('Login')} className='cursor-pointer'>Login here</p>
        }
      </div>
      {/* <div className='flex items-center justify-center border px-5 py-2 rounded-lg'>
        <button type='button' onClick={handleClick}>
          <GoogleIcon /> Continue with Google
        </button>
      </div> */}
      {message.error && <p className='text-red-500 text-lg'>{message.error}</p>}
      {message.success && <p className='text-green-500'>{message.success}</p>}
      <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-3'>
        {mode === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  )
}

export default Login