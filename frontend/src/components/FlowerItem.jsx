
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const FlowerItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <div className='border pt-2'>
      <Link className='text-gray-700 cursor-pointer' to={`/flower/${id}`}>
        <div className='flex flex-col items-center'>
          <div className='overflow-hidden'>
            <img className='w-40 hover:scale-110 transition ease-in-out' src={image} alt='' />
          </div>
          <div className='flex flex-col items-center pt-2'>
            <p className='text-sm'>{name}</p>
            <p className='text-sm font-medium text-red-500'>{price}{currency}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default FlowerItem