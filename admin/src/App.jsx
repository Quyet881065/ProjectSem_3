import { useEffect, useState } from 'react'
import Login from './components/Login'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add';
import Lists from './pages/Lists';
import Orders from './pages/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ViewOrderDetail from './pages/ViewOrderDetail';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '$'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');
  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer/>
      {token === "" ?
        <Login setToken={setToken}/>
        :
        <div>
           <Navbar setToken={setToken}/>
           <hr/>
           <div className='flex w-full'>
             <Sidebar/>
             <div className='w-[80%] my-8 ml-[max(3vw,25px)] text-base text-gray-600'>
              <Routes>
                <Route path='/add' element={<Add/>}/>
                <Route path='/list' element={<Lists/>}/>
                <Route path='/orders' element={<Orders/>}/>
                <Route path='/orders/:orderId' element={<ViewOrderDetail/>}/>
              </Routes>
             </div>
           </div>
        </div>
      }
    </div>
  )
}

export default App
