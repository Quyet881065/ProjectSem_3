import { Routes, Route, useNavigate} from "react-router-dom"
import { useContext, useEffect } from "react"
import { ToastContainer, toast } from "react-toastify"
import Navbar from "./components/Navbar"
import SearchBar from "./components/SearchBar"
import Home from "./pages/Home"
import About from "./pages/About"
import Footer from "./components/Footer"
import FlowerDetail from "./pages/FlowerDetail"
import Login from "./pages/Login"
import RequestChangePassWord from "./components/RequestChangePassWord"
import ResetPassword from "./components/ResetPassword"
import Cart from "./pages/Cart"
import PlaceOrder from "./pages/PlaceOrder"
import WeddingFlowers from "./pages/WeddingFlowers"
import OpeningFlowers from "./pages/OpeningFlowers"
import BirthdayFlowers from "./pages/BirthdayFlowers"
import Admin from "./pages/Admin/Admin"
import { ShopContext } from "./context/ShopContext"
import OrdersUser from "./pages/OrdersUser"
import OrderDetails from "./pages/OrderDetails"
import ViewOrderDetail from "./pages/ViewOrderDetail"

function App() {
  const role = localStorage.getItem("role");
  //const {navigate} = useContext(ShopContext)

  // useEffect(() => {
  //   if (role !== "admin") {
  //     navigate("/");
  //   }
  // }, [role, navigate]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[8vw]">
      <ToastContainer />
      {role !== "admin" && (
        <>
          <Navbar />
          <SearchBar />
        </>
      )}
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
        <Route path="/orders/:orderId" element = {<OrdersUser/>}/>
        <Route path="/orderdetails" element = {<OrderDetails/>}/>
        <Route path="/vieworder/:orderDetailId" element={<ViewOrderDetail/>}/>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      {role !== "admin" && (
        <Footer />
      )}
    </div>
  )
}

export default App
