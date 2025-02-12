
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import UploadFlower from './UploadFlower';
const Lists = () => {
  const [list, setList] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFlowerId, setSelectedFlowerId] = useState(null);
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

  const handleUploadClick = (flowerId) => {
    setSelectedFlowerId(flowerId);
    setShowUpload(true); // Hiển thị UploadFlower
  }

  console.log(list)
  useEffect(() => {
    fetchList();
  }, [])

  return (
    <div>
      {!showUpload && (
        <div>
          <p>All Flower List</p>
          <div className='flex flex-col gap-2'>
            <div className='hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_1fr] border border-gray-200 items-center px-2 py-2 text-sm'>
              <b>Image</b>
              <b>Name</b>
              <b>Category</b>
              <b>Price</b>
              <b className='text-center'>Active</b>
            </div>
            {list.map((item, index) => (
              <div key={index} className='grid grid-cols-[1fr_3fr_1fr] sm:grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center py-1 border border-gray-300 text-sm'>
                <img className='w-20' src={item.image} alt='' />
                <p>{item.flowerName}</p>
                <p>{item.category}</p>
                <p>{item.price}</p>
                <div className='flex flex-col gap-2'>
                  <button onClick={() => handleUploadClick(item.flowerId)} className='border border-gray-300 w-35 rounded-md py-1.5 bg-blue-500 text-white cursor-pointer'>Upload Flower</button>
                  <button onClick={() => removeFlower(item.flowerId)} className='border border-gray-300 w-35 rounded-md py-1.5 bg-red-500 text-white cursor-pointer'>Delete Flower</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showUpload && (<UploadFlower flowerId={selectedFlowerId} onClose={() => setShowUpload(false)} fetchList={fetchList}/>)}
    </div>
  )
}

export default Lists