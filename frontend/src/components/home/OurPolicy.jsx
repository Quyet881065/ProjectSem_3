import React from 'react';
import { assets } from '../../assets/assets';
import Title from '../layout/Title';
import { motion } from 'framer-motion';

const OurPolicy = () => {
  const policies = [
    { img: assets.vat, text: 'Price Include VAT' },
    { img: assets.support, text: '24/7 Service' },
    { img: assets.delivery, text: 'FAST flower delivery in 60 minutes' },
    { img: assets.icon_postcard, text: 'Free greeting cards' },
    { img: assets.icon_fresh_warranty, text: '3+ Days Fresh Warranty' },
    { img: assets.guarantee_smile, text: '100% Guarantee Smile' },
  ];

  return (
    <div className='flex flex-col items-center py-16'>
      <div className='text-center text-3xl font-medium mb-10'>
        <Title text2={"Why should you use our service?"} />
      </div>

      {/* Cột dọc các item */}
      <div className='grid grid-cols-3 gap-[80px] '>
        {policies.map((item, index) => (
          <motion.div
            key={index}
            className='flex flex-col items-center text-center'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
          >
            <img className='w-12 mb-4' src={item.img} alt='' />
            <p className='font-semibold text-gray-800 text-base sm:text-lg'>
              {item.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OurPolicy;
