
import axios from 'axios';
import React, { useState } from 'react'
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets.';

const UploadFlower = ({ flowerId, onClose, fetchList}) => {
    const [nameFlower, setNameFlower] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [bestseller, setBestSeller] = useState(false);
    const [image, setImage] = useState(null);

    const uploadFlowerData = async () => {
        try {
            const formData = new FormData();
            formData.append('flowerId', flowerId);
            formData.append('flowerName', nameFlower);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('bestseller', bestseller);
            formData.append('imageFile', image);
            const response = await axios.put(backendUrl + `/api/Flowers/${flowerId}`, formData);
            if (response.data.success) {
                toast.success("Flower uploaded successfully!")
                onClose(); // Đóng component UploadFlower
                fetchList();
            } else {
                toast.error('Failed to upload flower.');
            }
        } catch (error) {
            console.log(error);
            toast.error('Error uploading flower : ' + error.message);
        }
    }

    return (
        <div className='flex flex-col gap-5 max-w-[500px]'>
            <h2 className='text-2xl font-medium'>Upload Flower</h2>
            <div>
                <p className='text-lg'>Name</p>
                <input className='border px-1 py-2 rounded-lg w-full'
                    type="text"
                    placeholder="Flower Name"
                    value={nameFlower}
                    onChange={(e) => setNameFlower(e.target.value)}
                />
            </div>
            <div className='flex flex-row justify-between'>
                <div>
                    <p className='text-lg'>Price</p>
                    <input className='border px-1 py-2 rounded-lg'
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <div>
                    <p className='text-lg'>Category</p>
                    <select onChange={e => setCategory(e.target.value)} className='border px-2 py-2'>
                        <option value="">Select Category</option>
                        <option value="weddingflower">Wedding Flower</option>
                        <option value="openingflower">Opening Flower</option>
                        <option value="bithdayflower">Bithday Flower</option>
                    </select>
                </div>
            </div>
            <div>
                <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestSeller(e.target.checked)} />{' '}
                Bestseller
            </div>
            <div>
                <p className='text-lg'>Image</p>
                <label htmlFor='image'>
                    <img className='w-20' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt='' />
                    <input type="file" onChange={(e) => setImage(e.target.files[0])} id='image' hidden />
                </label>
            </div>
            <div className='flex flex-row justify-center gap-5'>
                <button className='border px-5 rounded-md bg-blue-500 text-white py-2 cursor-pointer' onClick={uploadFlowerData}>Upload</button>
                <button className='border px-5 rounded-md bg-red-500 text-white py-2 cursor-pointer' onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default UploadFlower