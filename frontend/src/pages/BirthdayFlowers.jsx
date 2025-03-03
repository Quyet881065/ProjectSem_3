
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import FlowerItem from '../components/FlowerItem';
import OurPolicy from '../components/OurPolicy';

const BirthdayFlowers = () => {
  const [birthdayFlower, setBirthdayFlower] = useState([]);
  const [sortOption, setSortOption] = useState('relevant')
  const {search, backendurl } = useContext(ShopContext)

  const fetchFlower = async (sortOption, flowerName) => {
    try {
      const response = await axios.get(backendurl + '/api/FlowerFilter', {
        params: {
          category: 'birthdayflower',
          sort : sortOption,
          flowerName : flowerName
        }
      })
      if (response.data.success) {
        setBirthdayFlower(response.data.flowers);
      } else {

      }
    } catch (error) {

    }
  }
  useEffect(() => {
    fetchFlower(sortOption, search)
  }, [sortOption, search])

  const handleSortChange = e =>{
    setSortOption(e.target.value)
  }
  console.log(birthdayFlower)

  return (
    <div className='flex flex-col border-t my-5'>
      <div className='flex justify-between items-center text-2xl font-medium my-10'>
        <Title text1={"BIRTHDAY"} text2={"FLOWERS"}/>
        <select onChange={handleSortChange} value={sortOption} className='border border-gray-500 text-sm px-2 py-2'>
          <option value="relevant">Sort by: Relevant</option>
          <option value="lowtohigh">Sort by: Low to High</option>
          <option value="hightolow">Sort by: High to Low</option>
        </select>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
        {birthdayFlower.map((item, index)=> (
          <FlowerItem key={index} id={item.flowerId} name={item.flowerName} price={item.price} image={item.image}/>
        ))}
      </div>
      <div className='py-10'>
        <OurPolicy/>
        </div>
    </div>
  )
}

export default BirthdayFlowers