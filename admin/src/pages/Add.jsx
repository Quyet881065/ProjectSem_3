import React, { useState } from 'react'
import { assets } from '../assets/assets.'
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
const Add = () => {
  const [flowerData, setFlowerData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    bestseller: false,
    image: null
  });

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    setFlowerData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }))
  }

  const onSubmitHandle = async e => {
    e.preventDefault();
    try {
      const fromData = new FormData();
      fromData.append('flowerName', flowerData.name);
      fromData.append('price', flowerData.price);
      fromData.append('description', flowerData.description);
      fromData.append('category', flowerData.category);
      fromData.append('bestseller', flowerData.bestseller);
      fromData.append('imageFile', flowerData.image);

      const response = await axios.post(backendUrl + '/api/Flowers', fromData)
      if (response.data.success) {
        setFlowerData({
          name: '',
          description: '',
          price: '',
          category: '',
          bestseller: false,
          image: null,
        })
        toast.success(response.data.message);
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
       console.log(error)
       toast.error(error.message)
    }
  }
  console.log(flowerData)

  return (
    <form onSubmit={onSubmitHandle} className='flex flex-col gap-5 w-full ml-5 text-lg'>
      <p className=' text-2xl font-medium'>ADD FLOWERS</p>
      <div>
        <p >Flower Name</p>
        <input onChange={handleChange} type='text' value={flowerData.name} name='name'
          className='w-full max-w-[600px] px-3 py-2 border'
          placeholder='Flower Name' />
      </div>
      <div>
        <p>Description</p>
        <textarea className='w-full max-w-[600px] border py-5' onChange={handleChange}
          name='description' value={flowerData.description}
        ></textarea>
      </div>
      <div className='flex flex-row justify-between max-w-[600px]'>
        <div>
          <p>Flower Category</p>
          <select name='category' onChange={handleChange}
            value={flowerData.category}
            className='w-full border px-5 py-2 text-center'>
            <option value="">Select Category</option>
            <option value="weddingflower">Wedding Flower</option>
            <option value="openingflower">Opening Flower</option>
            <option value="birthdayflower">Bithday Flower</option>
          </select>
        </div>
        <div>
          <p>Price</p>
          <input onChange={handleChange} name='price'
            value={flowerData.price}
            className='w-full border px-5 py-2 max-w-[200px]' type='number' />
        </div>
        <div className='flex flex-row items-center gap-2'>
          <label htmlFor='bestseller'>Add bestseller</label>
          <input name='bestseller' onChange={handleChange} checked={flowerData.bestseller} id='bestseller' type='checkbox' />
        </div>
      </div>
      <div className='flex flex-col'>
        <p>Upload Image</p>
        <label htmlFor='image' className='flex max-w-[100px]'>
          <img className='w-20' src={!flowerData.image ? assets.upload_area : URL.createObjectURL(flowerData.image)} alt='' />
          <input onChange={handleChange} type='file' name='image' hidden id='image' />
        </label>
      </div>
      <button type='submit' className='w-27 bg-black text-white py-3 rounded-lg'>ADD</button>
    </form>
  )
}

export default Add