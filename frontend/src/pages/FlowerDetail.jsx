
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import RelatedFlowers from '../components/RelatedFlowers';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const FlowerDetail = () => {
  const { flowerParamId } = useParams();
  const { flowers, currency, addToCart } = useContext(ShopContext);
  const [flowerData, setFlowerData] = useState(null);
  const [quantity, setQuantity] = useState(1);
 
  console.log('flowerParamId:', flowerParamId);
  console.log(flowers)

  const foundFlower = flowers.find((item) => item.flowerId === parseInt(flowerParamId));
  if (foundFlower && !flowerData) {
    setFlowerData(foundFlower);
  }

  if (!flowerData) {
    return <div>Loading flower details...</div>;
  }

  console.log(flowerData);

  // Cập nhật giá trị quantity khi người dùng thay đổi input
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex flex-col sm:flex-row gap-10'>
        <div className='w-[50%]'>
          <img className='rounded-lg shadow-lg ' src={flowerData.image} alt={flowerData.flowerName} />
        </div>
        <div className='flex-1'>
          <div className='text-center'>
            <h1 className='font-semibold text-3xl mt-3'>Name : {flowerData.flowerName}</h1>
          </div>
          <p className='mt-5  font-medium text-xl'>Call now :<span className='font-normal text-lg px-5'> 0912345678</span></p>
          <p className='mt-5 font-medium text-xl'>Price :<span className='font-normal text-lg px-5'> {currency}{flowerData.price}</span></p>
          <p className='mt-5 font-medium text-xl'>Delivery : <span className='font-normal text-lg px-5'>Free flower delivery in inner city areas</span></p>
          <div className='mt-5 flex flex-row items-center gap-3 mb-10'>
            <p className='font-medium text-xl mt-2'>Quantity : </p>
            <input className='border border-gray-800 py-1 w-20 mt-3' type='number' min="1"
              value={quantity}
              onChange={handleQuantityChange} />
          </div>
          <button onClick={() => addToCart(flowerData.flowerId, quantity, flowerData)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-10 my-5'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5 py-5' />
          <div className='text-sm text-gray-500 flex flex-col gap-2 mt-5'>
            <p>100% original product</p>
            <p>Cash on delivery is availabel on this product</p>
          </div>
          <div className='flex flex-row gap-3 mt-10'>
            <div className='flex flex-row '>
              <img className='w-20' src={assets.delivery} alt='' />
              <span>FAST flower delivery in 60 minutes</span>
            </div>
            <div className='flex flex-row'>
              <img className='w-20' src={assets.happycard} alt='' />
              <span>Free greeting cards</span>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
        </div>
        <div className='mt-5'>
          <p>{flowerData.description}</p>
        </div>
      </div>
      <RelatedFlowers category={flowerData.category} />
    </div>
  )
}

export default FlowerDetail