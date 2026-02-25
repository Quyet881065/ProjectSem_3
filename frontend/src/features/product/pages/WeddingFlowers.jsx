
import React, { useContext, useEffect, useState } from 'react'
import Title from '../../../components/layout/Title'
import { ShopContext } from '../../../context/ShopContext'
import FlowerItem from '../component/FlowerItem';
import OurPolicy from '../../home/components/OurPolicy';

const WeddingFlowers = () => {
 const { flowers, getFlowersByFilter } = useContext(ShopContext);
  const [sortType, setSortType] = useState("relevant");

  useEffect(() => {
    getFlowersByFilter("weddingflower", "", sortType);
  }, [sortType]);

  return (
    <div className='flex flex-col border-t my-5'>
      <div className='flex justify-between text-3xl font-medium my-10'>
        <Title text1={'WEDDING'} text2={"FLOWERS"} />
        <select onChange={e => setSortType(e.target.value)} className='border-2 border-gray-500 text-sm px-2'>
          <option value="relavent">Sort by : Relavent</option>
          <option value="low-high">Sort by : Low to High</option>
          <option value="high-low">Sort by : High to Low</option>
        </select>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {flowers.map((item, index) => (
          <FlowerItem key={index} id={item.id} name={item.flowerName} price={item.price} imageUrl={item.url} />
        ))}
      </div>
      <div className='py-10'>
        <OurPolicy />
      </div>
    </div>
  )
}

export default WeddingFlowers