import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import RelatedFlowers from '../components/RelatedFlowers'

const FlowerDetail = () => {
  const { flowerParamId } = useParams();
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const currency = '$';
  const [flowerData, setFlowerData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const token = localStorage.getItem('token');
  const { addToCartContext, getCartCount } = useContext(ShopContext)

  useEffect(() => {
    // Find the flower based on the URL parameter
    const getFlowerById = async () => {
      try {
        const response = await axios.get(`${backendurl}/api/Flowers/${flowerParamId}`);
        if (response.data.success) {
          setFlowerData(response.data.flower);
        } else {
          toast.error('Flower not found.');
        }
      } catch (error) {
        console.error('Error fetching flower details:', error);
        toast.error('Failed to load flower details.');
      }
    };
    getFlowerById();
  }, [flowerParamId, backendurl]);
  console.log(flowerData)

  if (!flowerData) {
    return <div>Loading flower details...</div>;
  }

  const addToCart = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !token) {
      toast.error('Please log in to add items to your cart.');
      return;
    }

    try {
      const cartItem = {
        UserId: userId,
        FlowerId: flowerData.flowerId,
        Quantity: quantity,
      };

      const response = await axios.post(`${backendurl}/api/Carts`, cartItem, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success('Added to cart successfully!');
        addToCartContext({
          flower: flowerData,
          quantity: quantity,
        });
        getCartCount();
      } else {
        toast.error('Failed to add to cart.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Error occurred while adding item to cart.');
    }
  };

  // Update quantity handler
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex flex-col sm:flex-row gap-5'>
        <div className='w-[40%]'>
          <img className='rounded-lg shadow-lg w-full max-w-[370px]' src={flowerData.image} alt={flowerData.flowerName} />
        </div>
        <div className='flex-1'>
          <div className='flex flex-col gap-3'>
            <h1 className='font-medium text-xl'>Name : {flowerData.flowerName}</h1>
            <p className='font-medium text-xl'>Price: {currency}{flowerData.price}</p>
            <p className='text-md'>{flowerData.description}</p>
            <p className='font-medium text-xl'>Products include: {flowerData.productsInclude}</p>
            <div className='flex flex-row items-center gap-5'>
              <p className='font-medium text-xl'>Quantity: </p>
              <input
                className='border border-gray-800 py-1 w-20 mt-3'
                type='number'
                min='1'
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
            <button onClick={addToCart} className='bg-blue-500 text-white px-8 py-3 text-base font-medium active:bg-gray-700 mt-5 max-w-60 rounded-md'>
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
      <hr className='mt-8 sm:w-4/5 py-5' />
      <div>
        <div className='text-center text-3xl'>
          <Title text2={"Why should you use our service?"} />
        </div>
        <div className='flex flex-row justify-between gap-3 mt-10'>
          <div className='flex flex-col items-center'>
            <img className='w-16' src={assets.delivery} alt='' />
            <p className='text-base font-medium'>FAST flower delivery in 60 minutes</p>
          </div>
          <div className='flex flex-col items-center'>
            <img className='w-16' src={assets.icon_postcard} alt='' />
            <p className='text-base font-medium'>Free greeting cards</p>
          </div>
          <div className='flex flex-col items-center'>
            <img className='w-16' src={assets.support} alt='' />
            <p className='text-base font-medium'>24/7 service</p>
          </div>
          <div className='flex flex-col items-center'>
            <img className='w-16  ' src={assets.vat} alt='' />
            <p className='text-base font-medium'>Price include VAT</p>
          </div>
        </div>
      </div>
      <div>
        <RelatedFlowers category={flowerData.category}/>
      </div>
    </div>
  )
}

export default FlowerDetail;
