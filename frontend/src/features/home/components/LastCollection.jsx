import React, { useContext, useState, useEffect } from 'react';
import Title from '../../../components/layout/Title';
import FlowerItem from '../../product/component/FlowerItem';
import { ShopContext } from '../../../context/ShopContext';
import { motion } from 'framer-motion';  // Thêm framer-motion

const LastCollection = () => {
  const { flowers, getFlowersByFilter } = useContext(ShopContext);
  console.log(flowers);
  // if (loading) {
  //   return (
  //     <div className="text-center py-10 text-gray-500 text-lg">
  //       Loading flowers...
  //     </div>
  //   );
  // }

   useEffect(() => {
      getFlowersByFilter("", "", "relevant");
    },[]);

  return (
    // <motion.div
    //   className='my-10'
    //   initial={{ opacity: 0, y: 200 }}  // Trạng thái ban đầu (ẩn)
    //   whileInView={{ opacity: 1, y: 10 }}  // Khi cuộn vào vùng nhìn thấy, hiện lên
    //   transition={{ duration: 1.5 }}  // Thời gian chuyển động
    // >
     <div className=''>
       <div className='text-center py-8 text-3xl'>
        <Title text1={'LATES'} text2={'COLLECTION'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {flowers.map((item, index) => (
          <FlowerItem 
            key={index}
            id={item.id}
            imageUrl={item.url} // truyền url gốc
            name={item.flowerName}
            price={item.price}
          />
        ))}
      </div>
     </div>
    //</motion.div>
  );
}

export default LastCollection;
