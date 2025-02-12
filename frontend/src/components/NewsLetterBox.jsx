
import React from 'react'

const NewsLetterBox = () => {
  return (
    <div className='text-center mt-20 border py-10 rounded-lg'>
        <p className='text-xl text-gray-500'>Register now to receive promotional information and special offers from: FlowerShop</p>
         <form className='w-full sm:w-1/2 flex items-center mx-auto gap-10 py-3 mt-5'>
            <input className='w-full sm:w-1/2 outline-none border py-2' type='email' placeholder='Enter Email'/>
            <button className='bg-black text-white px-8 py-2 text-sm'>OK</button>
         </form>
    </div>
  )
}

export default NewsLetterBox