import { Routes, Route, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import Navbar from "./components/layout/Navbar"
import SearchBar from "./components/layout/SearchBar"
import Home from "./features/home/pages/Home"
import About from "./features/product/pages/About"
import Footer from "./components/layout/Footer"
import FlowerDetail from "./features/product/pages/FlowerDetail"
import Login from "./features/auth/pages/Login"
import RequestChangePassWord from "./features/auth/pages/RequestChangePassWord"
import ResetPassword from "./features/auth/pages/ResetPassword"
import Cart from "./features/cart/pages/Cart"
import PlaceOrder from "./features/cart/pages/PlaceOrder"
import WeddingFlowers from "./features/product/pages/WeddingFlowers"
import OpeningFlowers from "./features/product/pages/OpeningFlowers"
import BirthdayFlowers from "./features/product/pages/BirthdayFlowers"
import OrdersUser from "./features/order/pages/OrdersUser"
import Order from "./features/order/pages/Orders"
import ViewOrderDetail from "./features/product/pages/ViewOrderDetail"
//import ChangePassword from "./pages/ChangePassword"
import ConfirmPayment from "./features/payment/pages/ConfirmPayment"
import Authentication from "./features/auth/pages/Authentication"
import ProfileUser from "./components/layout/ProfileUser"
import CreatePassword from "./features/auth/pages/CreatePassword"
import PaymentReturn from "./features/payment/pages/PaymentReturn"
import ChatButton from "./components/chat/ChatButton"
import ChatPopup from "./features/chat/pages/ChatPopup"

function App() {
  const [openChat, setOpenChat] = useState(false);
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[8vw]">
      <ToastContainer />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wedding-flowers" element={<WeddingFlowers />} />
        <Route path="/opening-flowers" element={<OpeningFlowers />} />
        <Route path="/birthday-flowers" element={<BirthdayFlowers />} />
        <Route path="/about" element={<About />} />
        <Route path="/flower/:flowerParamId" element={<FlowerDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<RequestChangePassWord />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders/:orderId" element={<OrdersUser />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/view-order/:orderId" element={<ViewOrderDetail />} />
        <Route path="/profile" element={<ProfileUser />} />
        <Route path="/confirm-payment" element={<ConfirmPayment />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/payment-return" element={<PaymentReturn />} />
        {/* <Route path="/chat" element={<Chat/>}/> */}
      </Routes>
      <Footer />
      {openChat && <ChatPopup onClose={() => setOpenChat(false)} />}
        
      {!openChat && (
        <ChatButton onClick={() => setOpenChat(true)} />
      )}

    </div>
  )
}

export default App
