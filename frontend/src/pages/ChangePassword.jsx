import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const ChangePassword = () => {
    const [message, setMessage] = useState(null);
    const [changePassword, setChangePassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const { backendurl } = useContext(ShopContext)

    const handleChange = e => {
        const { name, value } = e.target;
        setChangePassword(prev => ({
            ...prev,
            [name]: value
        }))
    }
    console.log(changePassword)

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const payload = {
                userId: userId,
                oldPassword: changePassword.oldPassword,
                newPassword: changePassword.newPassword,
                confirmNewPassword: changePassword.confirmPassword
            }
            const response = await axios.post(backendurl + '/api/Auth/change-password', payload,
                {
                    headers: {
                        'Content-Type': 'application/json' // Đảm bảo kiểu Content-Type là JSON
                    }
                }
            );
            if (response.data.success) {
                setMessage(response.data.message)
            } else {
                setMessage(response.data.message)
            }
        } catch (error) {
            // Kiểm tra nếu response từ backend có tồn tại
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);  // Hiển thị thông báo từ backend
            } else {
                setMessage("Có lỗi xảy ra khi đổi mật khẩu.");  // Thông báo mặc định nếu không có thông báo cụ thể
            }
            console.error("Error:", error);

        }
    }

    return (
        <form onSubmit={handleChangePassword}>
            <div className='border-t my-5'>
                <div className='text-center text-2xl font-medium my-10'>
                    <Title text1={"CHANGE"} text2={"PASSWORD"} />
                </div>
                <div className='flex flex-col items-center gap-5'>
                    <div className='min-w-[500px] flex items-center gap-5'>
                        <label className="text-lg font-medium text-red-500 whitespace-nowrap w-40">Old password:</label>
                        <input
                            onChange={handleChange} name='oldPassword' value={changePassword.oldPassword}
                            className="border border-gray-300 rounded-md shadow-sm px-1 py-2 w-full max-w-[300px]" type='text' />
                    </div>
                    <div className='min-w-[500px] flex items-center gap-5'>
                        <label className="text-lg font-medium text-red-500 whitespace-nowrap w-40">New password:</label>
                        <input
                            onChange={handleChange} name='newPassword' value={changePassword.newPassword}
                            className="border border-gray-300 rounded-md shadow-sm  px-1 py-2 w-full max-w-[300px]" type='text' />
                    </div>
                    <div className='min-w-[500px] flex items-center gap-5'>
                        <label className="text-lg font-medium text-red-500 whitespace-nowrap w-40">Confirm Password:</label>
                        <input
                            onChange={handleChange} name='confirmPassword' value={changePassword.confirmPassword}
                            className="border  border-gray-300 rounded-md shadow-sm px-1 py-2 w-full max-w-[300px]" type='text' />
                    </div>
                    {message && <p className='text-red-500'>{message}</p>}
                    <div className='my-5'>
                        <button type='submit' className='border bg-blue-500 text-white text-xl font-normal px-5 py-2 rounded-lg'>Confirm</button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ChangePassword