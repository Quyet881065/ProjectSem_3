
import React from 'react'
import { assets } from '../assets/assets'
import Title from './Title'

const OurPolicy = () => {
  return (
    <div className='flex flex-col'>
      <div className='text-center text-3xl font-medium'>
      <Title text2={"Why should you use our service ?"}/>
      </div>
      <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
          <img className='w-12 m-auto mb-5' src={assets.exchange_icon} alt='' />
          <p className='font-semibold'>Return and refund policy</p>
        </div>
        <div>
          <img className='w-12 m-auto mb-5' src={assets.quanlity_icon} alt='' />
          <p className='font-semibold'>Information security policy</p>
        </div>
        <div>
          <img className='w-12 m-auto mb-5' src={assets.support_img} alt='' />
          <p className='font-semibold'>Best customer support</p>
        </div>
      </div>
      <div className='flex flex-row gap-20 justify-center'>
        <div>
          <img className='w-12 m-auto mb-5 ' src={assets.icon_postcard} alt='' />
          <p className='font-semibold'>Free greeting cards</p>
        </div>
        <div>
          <img className='w-12 m-auto mb-5' src={assets.icon_fresh_warranty} alt='' />
          <p className='font-semibold'>3+ days fresh warranty</p>
        </div>
      </div>
    </div>
  )
}

export default OurPolicy