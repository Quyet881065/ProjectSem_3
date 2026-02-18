import { useEffect, useState } from 'react'
import Login from './components/Login'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes , useLocation, Navigate} from 'react-router-dom';
import Add from './pages/Add';
import Lists from './pages/Lists';
import Orders from './pages/Orders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import ViewOrderDetail from './pages/ViewOrderDetail';
import Dashboard from './pages/Dashboard';
import User from './pages/User';
import ChatDashBoard from './features/chat/page/ChatDashBoard';
import { getToken } from './service/localStorageService';

export const currency = '$'

function App() {
  //const [token,setToken] = useState(getToken() || null);

  const location = useLocation();


  // Kiểm tra nếu đang ở trang login
  const isLoginPage = location.pathname === '/login';
 
  return (
   <div className="bg-gray-50 min-h-screen">
      <ToastContainer />

      {/* Ẩn Navbar + Sidebar ở trang login */}
      {!isLoginPage && <Navbar />}
      <div className="flex w-full">
        {!isLoginPage && <Sidebar />}

        <div className="w-[85%] my-8 ml-[max(1vw,25px)] text-base text-gray-600">
          <Routes>
            {/* Trang login */}
            <Route path="/login" element={<Login />} />

            {/* Nếu chưa đăng nhập → redirect về /login */}
            {!getToken() ? (
              <Route path="*" element={<Navigate to="/login" replace />} />
            ) : (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<Lists />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:orderId" element={<ViewOrderDetail />} />
                <Route path="/users" element={<User />} />
                <Route path='/chats' element={<ChatDashBoard/>}/>
              </>
            )}
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App
