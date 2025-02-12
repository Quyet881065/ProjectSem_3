
import React, { useContext } from 'react'
import { useState } from 'react';
import Title from '../../components/Title'
import { assets } from '../../assets/assets';
import axios from 'axios';
import { ShopContext } from '../../context/ShopContext';
import { toast } from 'react-toastify';

const AddFlower = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [bestseller, setBestseller] = useState(false);
    const [image, setImage] = useState(false);
    const {backendurl} = useContext(ShopContext)

    const onSubmitHandle = async(e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('flowerName', name)
            formData.append('description',description)
            formData.append('price' ,price)
            formData.append('bestseller',bestseller)
            formData.append('imageFile',image)
            formData.append('category',category)

            const response = await axios.post(backendurl + '/api/Flowers' , formData)
            console.log(response.data)
            if(response.data.success){
                setName('')
                setDescription('')
                setCategory('')
                setImage(false)
                setPrice('')
                toast.success(response.data.message)
                  
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandle} className='flex flex-col gap-3 w-full ml-5 text-lg'>
            <div className='text-2xl text-center'>
                <Title text1={"ADD"} text2={"FLOWER"} />
            </div>
            <div className='w-full'>
                <p className='mb-2'>Flower Name</p>
                <input onChange={e => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border' type='text' placeholder='Type here' />
            </div>
            <div>
                <p className='mb-2'>Description</p>
                <textarea onChange={e => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] border py-2'></textarea>
            </div>
            <div className='flex flex-col sm:flex-row gap-10 sm:gap-20 '>
                <div>
                    <p className='mb-2'>Flower Category</p>
                    <select onChange={e => setCategory(e.target.value)} value={category} className='w-full px-5 py-2 border'>
                        <option value="">Select Category</option>
                        <option value="weddingflower">Wedding Flower</option>
                        <option value="openingfflower">Opening Flower</option>
                        <option value="birthdayflower">Birthday Flower</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Price</p>
                    <input onChange={e => setPrice(e.target.value)} value={price} className='w-full max-w-[130px] px-3 py-2 border' type='number' />
                </div>
            </div>
            <div className='flex gap-2 mt-2'>
                <input onChange={e => setBestseller(e.target.checked)} type='checkbox' id='bestseller'/>
                <label className='cursor-pointer' htmlFor='bestseller'>Add bestseller</label>
            </div>
            <div className=''>
                <p>Upload Image</p>
                <div className='flex gap-2'>
                    <label htmlFor='image'>
                        <img className='w-20' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt=''/>
                        <input onChange={e => setImage(e.target.files[0])} type='file' id='image' hidden/>
                    </label>
                </div>
            </div>
            <button type='submit' className='bg-black w-28 text-white py-3 mt-5'>ADD</button>
        </form>
    )
}

export default AddFlower