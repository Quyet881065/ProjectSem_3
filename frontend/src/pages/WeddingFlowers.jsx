
import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import FlowerItem from '../components/FlowerItem';
import RelatedFlowers from '../components/RelatedFlowers';
import OurPolicy from '../components/OurPolicy';

const WeddingFlowers = () => {
  const { flowers, search, showSearch } = useContext(ShopContext);
  const [weddingFlowers, setWeddingFlowers] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  console.log(search)
  console.log(showSearch)
  console.log(weddingFlowers)

  const sortFlower = (flowersToSort) => {
    let sortedFlowers;
    if (sortType === "low-high") {
      sortedFlowers = [...flowersToSort].sort((a, b) => a.price - b.price);
      //[...flowersToSort]: Sử dụng spread operator (...) để sao chép mảng flowersToSort thành một mảng mới (để không thay đổi dữ liệu gốc).
    } else if (sortType === "high-low") {
      sortedFlowers = [...flowersToSort].sort((a, b) => b.price - a.price);
      //.sort((a, b) => b.price - a.price): Sắp xếp mảng theo thứ tự giảm dần của giá. Nếu b.price lớn hơn a.price, b sẽ đứng trước a trong mảng kết quả.
    } else {
      // 'relavent' giữ nguyên thứ tự ban đầu
      sortedFlowers = flowersToSort;
    }
    setWeddingFlowers(sortedFlowers);
  }

  const searchFilter = (flowersToFilter)=> {
    if(search && showSearch){
      return flowersToFilter.filter(flower => flower.flowerName.toLowerCase().includes(search.toLowerCase()))
    }
    return flowersToFilter;
  }

  useEffect(() => {
    // Lọc các bông hoa thuộc danh mục "weddingflower"
    let filteredFlowers = flowers.filter(flower => flower.category === "weddingflower");
    // Áp dụng bộ lọc tìm kiếm
    filteredFlowers = searchFilter(filteredFlowers);
    // Sap xep flower theo price
    sortFlower(filteredFlowers);
  }, [flowers, sortType, search, showSearch])

  return (
    <div className='flex flex-col border-t my-5'>
      <div className='flex justify-between text-3xl font-medium my-10'>
        <Title text1={'WEDDING'} text2={"FLOWERS"} />
        <select onChange={e => setSortType(e.target.value)} className='border-2 border-gray-500 text-sm px-2'>
          <option value="relavent">Sort by : Relavent</option>
          <option value="low-high">Sort by : Low to High</option>
          <option value="high-low">Sort by : High to Low</option>
        </select>
      </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'>
          {weddingFlowers.map((item, index) => (
            <FlowerItem key={index} id={item.flowerId} name={item.flowerName} price={item.price} image={item.image} />
          ))}
        </div>
        <div className='py-10'>
        <OurPolicy/>
        </div>
      </div>
  )
}

export default WeddingFlowers