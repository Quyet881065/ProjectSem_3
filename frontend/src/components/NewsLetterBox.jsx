
import React from 'react'
import { motion } from 'framer-motion';

const NewsLetterBox = () => {
  return (
    <motion.div
      className='my-10'
      initial={{ opacity: 0, y: 100 }}  // Trạng thái ban đầu (ẩn)
      whileInView={{ opacity: 1, y: 10 }}  // Khi cuộn vào vùng nhìn thấy, hiện lên
      transition={{ duration: 1.5 }}  // Thời gian chuyển động
    >
    <div className='text-center mt-20 border py-10 rounded-lg'>
        <p className='text-xl '>Register now to receive promotional information and special offers from: FlowerShop</p>
         <form className='w-full sm:w-1/2 flex items-center mx-auto gap-10 py-3 mt-5'>
            <input className='w-full sm:w-1/2 outline-none border py-2' type='email' placeholder='Enter Email'/>
            <button className='bg-blue-500 text-white px-8 py-2 text-sm'>OK</button>
         </form>
    </div>
    </motion.div>
  )
}

export default NewsLetterBox