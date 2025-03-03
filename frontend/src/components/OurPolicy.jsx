import React from 'react';
import { assets } from '../assets/assets';
import Title from './Title';
import { motion } from 'framer-motion';  // Thêm framer-motion

const OurPolicy = () => {
  return (
    <div className='flex flex-col'>
      <div className='text-center text-3xl font-medium'>
        <Title text2={"Why should you use our service?"} />
      </div>

      <div className='flex flex-col sm:flex-row justify-around text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <motion.div
          initial={{ x: -100, opacity: 0 }}  // Bắt đầu từ bên trái
          whileInView={{ x: 0, opacity: 1 }}  // Khi hiện trong vùng nhìn thấy, trượt vào
          transition={{ duration: 0.6 }}  // Thời gian chuyển động
        >
          <img className='w-12 m-auto mb-5' src={assets.vat} alt='' />
          <p className='font-semibold'>Price Include VAT</p>
        </motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}  // Thêm độ trễ cho hiệu ứng
        >
          <img className='w-12 m-auto mb-5' src={assets.support} alt='' />
          <p className='font-semibold'>24/7 Service</p>
        </motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <img className='w-12 m-auto mb-5' src={assets.delivery} alt='' />
          <p className='font-semibold'>FAST flower delivery in 60 minutes</p>
        </motion.div>
      </div>

      <div className='flex flex-row justify-around'>
        <motion.div
          initial={{ x: 100, opacity: 0 }}  // Bắt đầu từ bên phải
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img className='w-12 m-auto mb-5' src={assets.icon_postcard} alt='' />
          <p className='font-semibold'>Free greeting cards</p>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img className='w-12 m-auto mb-5' src={assets.icon_fresh_warranty} alt='' />
          <p className='font-semibold'>3+ Days Fresh Warranty</p>
        </motion.div>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img className='w-12 m-auto mb-5' src={assets.guarantee_smile} alt='' />
          <p className='font-semibold'>100% Guarantee Smile</p>
        </motion.div>
      </div>
    </div>
  );
}

export default OurPolicy;
