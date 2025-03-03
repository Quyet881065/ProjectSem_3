import React, { useContext } from 'react';
import Title from './Title';
import FlowerItem from './FlowerItem';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';  // Thêm framer-motion

const LastCollection = () => {
  const { flowers } = useContext(ShopContext);

  return (
    <motion.div
      className='my-10'
      initial={{ opacity: 0, y: 200 }}  // Trạng thái ban đầu (ẩn)
      whileInView={{ opacity: 1, y: 10 }}  // Khi cuộn vào vùng nhìn thấy, hiện lên
      transition={{ duration: 1.5 }}  // Thời gian chuyển động
    >
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATES'} text2={'COLLECTION'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {flowers.map((item, index) => (
          <FlowerItem
            key={index}
            id={item.flowerId}
            image={item.image}
            name={item.flowerName}
            price={item.price}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default LastCollection;
