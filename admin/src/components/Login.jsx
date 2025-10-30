import React, { useContext, useState } from 'react'
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { setExpirationTime, setToken } from '../service/localStorageService';
import { logIn } from '../service/authenticationService';
import { API, CONFIG } from '../configuration/configuration';

const Login = () => {
  const {backendurl, navigate} = useContext(ShopContext);
  const [message, setMessage] = useState({success:'', error:''})
  const [formData, setFormData] = useState({
    username : '',
    password : ''
  })

  const handldeChange = e => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  console.log(formData);

   const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      const data = await logIn(formData.username, formData.password);
      console.log("Login response:", data);

      if (data.statusCode === 200 && data.results.role === "ROLE_ADMIN") {
        const token = data.results.token;
        const expiryTime = data.results.expiryTime;

        if (token && expiryTime) {
          // Lưu token & thời gian hết hạn
          setToken(token);
          setExpirationTime(expiryTime);

          // Gắn token vào header mặc định
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          console.log("Đăng nhập thành công, tiến hành refresh token ngay...");

          // 🔁 Gửi request refresh token luôn
          const refreshResponse = await axios.post(`${CONFIG.API_GATEWAY}${API.REFRESH}`, {
            token
          });

          if (refreshResponse.data?.results) {
            const newToken = refreshResponse.data.results.token;
            const newExpiry = refreshResponse.data.results.expiryTime;

            setToken(newToken);
            setExpirationTime(newExpiry);
            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            console.log("Token đã được refresh ngay sau login");
          }

          setMessage({ success: "Login success" });
          navigate('/');
        } else {
          setMessage({ error: "Token không hợp lệ" });
        }
      } else {
        setMessage({ error: "You do not have access" });
      }
    } catch (error) {
      console.error("Lỗi khi login:", error);
      setMessage({ error: "Đăng nhập thất bại, vui lòng thử lại" });
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg max-w-md px-8 py-6'>
        <h1 className='text-2xl font-bold mb-5'>Admin Panel</h1>
        <form onSubmit={onSubmitHandle}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>User name</p>
            <input onChange={handldeChange} name='username' value={formData.username} className='border border-gray-300 rounded-md w-full outline-none px-3 py-2' type='text' placeholder='User name' />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input onChange={handldeChange} name='password' value={formData.password} className='border border-gray-300 rounded-md w-full px-3 py-2' type='password' placeholder='Password' />
          </div>
          {message.error && <p className='text-red-500 text-lg'>{message.error}</p>}
          {message.success && <p className='text-green-500 text-lg'>{message.success}</p>}
          <button className='mt-2 bg-black text-white px-5 py-2 w-full rounded-md' type='submit'>Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login