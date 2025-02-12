
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import FlowerItem from './FlowerItem'

const RelatedFlowers = ({category}) => {
    const {flowers} = useContext(ShopContext);
    const [related, setRelated] = useState([]);
    useEffect(()=>{
        if(flowers.length > 0){
            let flowerCopy = flowers.slice();
            flowerCopy = flowerCopy.filter(item => category == item.category);
            setRelated(flowerCopy.slice(0,5));
        }
    },[flowers]);
    console.log(related)
  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-3'>
           <Title text1={'RELATED'} text2={'FLOWERS'}/>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 '>
           {related.map((item,index)=> (
            <FlowerItem key={index} id={item.flowerId} name={item.flowerName} image={item.image} price={item.price}/>
           ))}
        </div>
    </div>
  )
}

export default RelatedFlowers