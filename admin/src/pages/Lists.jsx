
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import UploadFlower from './UploadFlower';
import { assets } from '../assets/assets.';
const Lists = () => {
  const [list, setList] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
  const [search, setSearch] = useState('');
  const [sortCategory, setSortCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  const fetchList = async e => {
    try {
      const response = await axios.get(backendUrl + '/api/Flowers');
      if (response.data.success) {
        setList(response.data.flowers);
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeFlower = async (id) => {
    try {
      const response = await axios.delete(backendUrl + `/api/Flowers/${id}`)
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const filterFlower = async (flowerName, sortCategory, sortOption) => {
    try {
      const response = await axios.get(backendUrl + '/api/FlowerFilter', {
        params: {
          category: sortCategory,
          flowerName: flowerName,
          sort: sortOption
        }
      })
      if (response.data.success) {
        setList(response.data.flowers)
      } else {

      }
    } catch (error) {

    }
  }

  const handleUploadClick = (flowerId) => {
    setSelectedFlowerId(flowerId);
    setShowUpload(true); // Hiển thị UploadFlower
  }

  console.log(list)
  useEffect(() => {
    fetchList();
  }, [])

  useEffect(() => {
    filterFlower(search, sortCategory, sortOption)
  }, [search, sortCategory, sortOption])

  return (
    <div>
      {!showUpload && (
        <div>
          <p className='text-center font-medium text-2xl mb-5'>All Flower List</p>
          <div className='flex justify-around my-3'>
            <div className='inline-flex border px-2 py-2 rounded-lg bg-inherit'>
              <input onChange={(e) => setSearch(e.target.value)} value={search} type='text' className='flex-1 outline-none' placeholder='Search' />
              <img src={assets.search_icon} alt='' className='w-5 cursor-pointer' />
            </div>
            <select onChange={e => setSortCategory(e.target.value)} value={sortCategory}
              className='border px-2 rounded-md'>
              <option value=''>Select Category</option>
              <option value='openingflower'>Opening Flower</option>
              <option value='weddingflower'>Wedding Flower</option>
              <option value='birthdayflower'>Bidthday Flower</option>
            </select>
            <select onChange={e => setSortOption(e.target.value)} value={sortOption} className='border rounded-md text-sm px-2 py-2'>
              <option value="relevant">Sort by: Relevant</option>
              <option value="lowtohigh">Sort by: Low to High</option>
              <option value="hightolow">Sort by: High to Low</option>
            </select>
          </div>
          <div className='flex flex-col gap-2'>
            <div className='hidden md:grid grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr] border border-gray-200 items-center px-2 py-2 text-sm'>
              <b>STT</b>
              <b>Image</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b className='text-center'>Active</b>
            </div>
            {list.map((item, index) => (
              <div key={index} className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_1fr] items-center border border-gray-300 text-sm'>
                <p className='pl-3'>{index + 1}</p>
                <img className='w-12' src={item.image} alt='' />
                <p>{item.flowerName}</p>
                <p>{item.category}</p>
                <p>${item.price}</p>
                <div className='flex flex-col gap-1'>
                  <button onClick={() => handleUploadClick(item.flowerId)} className='border border-gray-300 w-35 rounded-md py-1.5 bg-blue-500 text-white cursor-pointer'>Upload Flower</button>
                  <button onClick={() => removeFlower(item.flowerId)} className='border border-gray-300 w-35 rounded-md py-1.5 bg-red-500 text-white cursor-pointer'>Delete Flower</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showUpload && (<UploadFlower flowerId={selectedFlowerId} onClose={() => setShowUpload(false)} fetchList={fetchList} />)}
    </div>
  )
}

export default Lists