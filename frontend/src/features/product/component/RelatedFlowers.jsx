import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../../../context/ShopContext'
import Title from '../../../components/layout/Title'
import FlowerItem from './FlowerItem'

const RelatedFlowers = ({ category }) => {
  const { flowers } = useContext(ShopContext)
  const [related, setRelated] = useState([])

  useEffect(() => {
    if (flowers.length > 0 && category) {
      // Lọc theo category
      const filtered = flowers.filter(
        (item) => item.category === category
      )
      // Giới hạn 5 sản phẩm
      setRelated(filtered.slice(0, 5))
    }
  }, [flowers, category])

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-3'>
        <Title text1={'RELATED'} text2={'FLOWERS'} />
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
        {related.map((item) => (
          <FlowerItem
            key={item.id}
            id={item.id}
            name={item.flowerName}
            imageUrl={item.url}
            price={item.price}
          />
        ))}
      </div>
    </div>
  )
}

export default RelatedFlowers
