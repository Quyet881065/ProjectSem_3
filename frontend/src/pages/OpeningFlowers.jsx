import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import FlowerItem from '../components/FlowerItem'
import { ShopContext } from '../context/ShopContext';

const OpeningFlowers = () => {
    const [openingFlowers, setOpeningFlowers] = useState([]);
    const { flowers } = useContext(ShopContext);
    useEffect(() => {
        let filteredFlowers = flowers.filter(flower => flower.category === "openingflower");
        setOpeningFlowers(filteredFlowers);
    }, [flowers])
    return (
        <div className='flex flex-col'>
            <div className='flex justify-between items-center text-2xl font-medium my-10'>
                <Title text1={"OPENING"} text2={"FLOWERS"} />
                <select className='border border-gray-500 text-sm px-2 py-2'>
                   <option>Sort by : Relavent</option>
                   <option>Sort by : Low to High</option>
                   <option>Sort by : High to Low</option>
                </select>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-colss-5 gap-5'>
                {openingFlowers.map((item, index) => (
                    <FlowerItem key={index} id={item.flowerId} name={item.flowerName} price={item.price} image={item.image} />
                ))}
            </div>
        </div>
    )
}

export default OpeningFlowers