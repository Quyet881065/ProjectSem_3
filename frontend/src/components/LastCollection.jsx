
import React, { useContext } from 'react'
import Title from './Title'
import FlowerItem from './FlowerItem'
import { ShopContext } from '../context/ShopContext'

const LastCollection = () => {
  const {flowers} = useContext(ShopContext);
  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text1={'LATES'} text2={'COLLECTION'}/>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
            {
              flowers.map((item, index)=>(
                <FlowerItem key={index}
                   id={item.flowerId}
                   image={item.image}
                   name ={item.flowerName}
                   price={item.price}
                />
              ))
            }
        </div>
    </div>
  )
}

export default LastCollection