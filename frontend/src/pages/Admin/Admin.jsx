
import React from 'react'
import Navbar from '../../components/Admin/Navbar'
import Sidebar from '../../components/Admin/Sidebar'
import { Route, Routes } from 'react-router-dom'
import AddFlower from './AddFlower'
import ListFlowers from './ListFlowers'
import Orders from './Orders'

const Admin = () => {
  // return (
  //   <div>
  //     <div>
  //       <Navbar />
  //       <hr />
  //       <div>
  //         <Sidebar />
  //         <Routes>
  //           <Route path="add" element={<AddFlower />} />
  //           <Route path='/list' element={<ListFlowers />} />
  //           <Route path="*" element={<div>404 Not Found</div>} />
  //         </Routes>
  //       </div>
  //     </div>
  //   </div>
  // )
  return (
    <div className='bg-gray-50 min-h-screen '>
      <Navbar />
      <hr />
      <div className="flex w-full">
        <Sidebar />
        <div className="w-[90%] my-8 text-base">
          <Routes>
            <Route path="add" element={<AddFlower />} />
            <Route path="list" element={<ListFlowers />} />
            <Route path="ordersadmin" element= {<Orders/>}/>
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin