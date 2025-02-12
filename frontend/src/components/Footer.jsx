
import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img className='mb-5 w-32' src={assets.logo} alt='' />
                    <p className='w-full md:w-2/3 text-gray-600'>Flower</p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Introduction to flowers</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Flower meaning</li>
                        <li>How to care for flowers</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>Customer care</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Information security policy</li>
                        <li>Policies and terms</li>
                        <li>Ordering instructions</li>
                        <li>Delivery fee</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>SHOP FLOWER</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Introduce</li>
                        <li>News</li>
                        <li>Frequently Asked Questions (FAQs)</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Phone : 0912345678</li>
                        <li>Email : abc@gmail.com</li>
                        <li>Address : My Dinh Ha Noi</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-center text-sm'>Copyright 2024@ forever</p>
            </div>
        </div>
    )
}

export default Footer