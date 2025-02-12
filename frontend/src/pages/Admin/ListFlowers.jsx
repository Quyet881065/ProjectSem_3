
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../context/ShopContext'
import { toast } from 'react-toastify'

const ListFlowers = () => {

  const[list, setList] = useState([])
  const {backendurl, currency} = useContext(ShopContext)
  const fetchList = async()=>{
    try {
      const response = await axios.get(backendurl + '/api/Flowers')
      if(response.data.success){
        setList(response.data.flowers)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  console.log(list)
  const removeFlower = async(id) =>{
    try {
      const response = await axios.delete(backendurl + `/api/Flowers/${id}`)
      if(response.data.success){
        setList(list.filter(item => item.flowerId !== id))
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  useEffect(()=>{
    fetchList()
  },[]) 

  return (
    <div>
      <p className='mb-2 text-2xl font-medium text-center'>All Flower List</p>
      <div>
        <div className='hidden sm:grid grid-cols-[1fr_2fr_2fr_1fr_1fr] border border-gray-200 text-sm items-center py-2 px-2'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className='text-center'>Active</b>
        </div>
        {list.map((item, index)=>(
          <div className='grid grid-cols-[1fr_2fr_2fr_1fr_1fr] items-center gap-2 border text-sm px-2 py-2'>
            <img src={item.image} alt='' className='w-12'/>
            <p>{item.flowerName}</p>
            <p>{item.category}</p>
            <p>{item.price}{currency}</p>
            <p onClick={()=> removeFlower(item.flowerId)} className='text-right sm:text-center cursor-pointer text-lg'>X</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListFlowers