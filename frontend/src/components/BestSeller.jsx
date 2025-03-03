
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import FlowerItem from './FlowerItem'
import { motion } from 'framer-motion'

const BestSeller = () => {
    const {flowers} = useContext(ShopContext);
    const [bestSellers, setBestSeller] = useState([]);

    useEffect(()=>{
       const bestSeller = flowers.filter(item => item.bestseller);
       setBestSeller(bestSeller.slice(0,15));
    },[flowers])
    
    return (
        <motion.div
        className='my-10'
        initial={{ opacity: 0, y: 250 }}  // Trạng thái ban đầu (ẩn)
        whileInView={{ opacity: 1, y: 10 }}  // Khi cuộn vào vùng nhìn thấy, hiện lên
        transition={{ duration: 1.5 }}  // Thời gian chuyển động
      >
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
               {bestSellers.map((item, index)=>(
                <FlowerItem key={index} id={item.flowerId} name={item.flowerName} price={item.price} image={item.image}/>
               ))}
            </div>
        </div>
        </motion.div>
    )
}

export default BestSeller