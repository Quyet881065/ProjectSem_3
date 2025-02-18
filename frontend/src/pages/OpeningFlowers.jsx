import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import FlowerItem from '../components/FlowerItem'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const OpeningFlowers = () => {
    const [openingFlowers, setOpeningFlowers] = useState([]);
    const [sortOption, setSortOption] = useState('relevant');
    const { search, showSearch, backendurl } = useContext(ShopContext);

    const fetchFlowers = async (sortOption, flowerName) => {
        try {
            const response = await axios.get(backendurl + '/api/FlowerFilter', {
                params: {
                    category: 'openingflower',
                    sort: sortOption,
                    flowerName : flowerName
                }
            }
            )
            if (response.data.success) {
                setOpeningFlowers(response.data.flowers);
            } else {
                console.error("Error fetching flowers: ", response.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
    useEffect(() => {
        fetchFlowers(sortOption, search);
    }, [sortOption, search]);

    const handleSortChange = e =>{
        setSortOption(e.target.value)
    }
    console.log(openingFlowers)

    return (
        <div className='flex flex-col border-t my-5'>
            <div className='flex justify-between items-center text-2xl font-medium my-10'>
                <Title text1={"OPENING"} text2={"FLOWERS"} />
                <select onChange={handleSortChange} value={sortOption} className='border border-gray-500 text-sm px-2 py-2'>
                <option value="relevant">Sort by: Relevant</option>
                <option value="lowtohigh">Sort by: Low to High</option>
                <option value="hightolow">Sort by: High to Low</option>
                </select>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
                {openingFlowers.map((item, index) => (
                    <FlowerItem key={index} id={item.flowerId} name={item.flowerName} price={item.price} image={item.image} />
                ))}
            </div>
        </div>
    )
}

export default OpeningFlowers