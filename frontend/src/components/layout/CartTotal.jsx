
import React, { useContext } from 'react'
import { ShopContext } from '../../context/ShopContext'
import Title from './Title';

const CartTotal = () => {
  const { currency, cart } = useContext(ShopContext);

  const getCartAmount = () => {
    if(!cart || !Array.isArray(cart.items)) return 0; 
    return cart.items.reduce((count, item) => count + item.price * item.quantity, 0)
  }

  const formatNumber = (value)=>{
    return new Intl.NumberFormat('vi-Vn',{
      style:'currency',
      currency:'VND'
    }).format(value)
  }

  console.log('Cart in CartTotal:', cart);

  return (
    <div className='w-full'>
      <div className='text-2xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>
      <div className='flex flex-col gap-3 mt-3 text-sm'>
        <div className='flex justify-between'>
          <p>Subtotal</p>
          <p>{formatNumber(getCartAmount())}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Shipping Fee</p>
          <p>{formatNumber(10000)}</p>
        </div>
        <hr />
        <div className='flex justify-between'>
          <p>Total</p>
          <p>{formatNumber(getCartAmount()+ 10000)}</p>
        </div>
      </div>
    </div>
  )
}

export default CartTotal