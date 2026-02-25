import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../../context/ShopContext';
import Title from '../../../components/layout/Title';
import FlowerItem from '../component/FlowerItem';
import OurPolicy from '../../home/components/OurPolicy';

const BirthdayFlowers = () => {
  const { flowers, getFlowersByFilter } = useContext(ShopContext);
  const [sortOption, setSortOption] = useState("relevant");
  useEffect(() => {
    getFlowersByFilter("birthdayflower", "", sortOption);
  }, [sortOption]);
  return (
    <div className='flex flex-col border-t my-5'>
      <div className='flex justify-between items-center text-2xl font-medium my-10'>
        <Title text1={"BIRTHDAY"} text2={"FLOWERS"}/>
        <select onChange={e => setSortOption(e.target.value)} value={sortOption} className='border border-gray-500 text-sm px-2 py-2'>
          <option value="relevant">Sort by: Relevant</option>
          <option value="low-high">Sort by: Low to High</option>
          <option value="high-low">Sort by: High to Low</option>
        </select>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {flowers.map((item, index)=> (
          <FlowerItem key={index} id={item.flowerId} name={item.flowerName} price={item.price} imageUrl={item.url}/>
        ))}
      </div>
      <div className='py-10'>
        <OurPolicy/>
        </div>
    </div>
  )
}

export default BirthdayFlowers