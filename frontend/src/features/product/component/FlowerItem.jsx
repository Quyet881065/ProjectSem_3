import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getToken } from '../../../service/localStorageService'
import axios from 'axios'

const FlowerItem = ({ id, imageUrl, name, price }) => {
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const token = getToken();
        const response = await axios.get(imageUrl, {
         // headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        });
        setImgSrc(URL.createObjectURL(response.data));
      } catch (err) {
        console.error("Error fetching image:", err);
      }
    };
    loadImage();
  }, []);
  return (
    <div className='border pt-2'>
      <Link className='text-gray-700 cursor-pointer' to={`/flower/${id}`}>
        <div className='flex flex-col items-center'>
          <div className='overflow-hidden'>
            <img className='w-40 hover:scale-110 transition ease-in-out' src={imgSrc} alt='' />
          </div>
          <div className='flex flex-col items-center pt-2'>
            <p className='text-sm '>{name}</p>
            <p className='text-sm font-medium text-red-500'>
              {price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default FlowerItem