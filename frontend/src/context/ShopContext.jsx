import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
export const ShopContext = createContext();

const ShopContextProvider = props => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false);
    const [flowers, setFlowers] = useState([]);
    const [token, setToken] = useState('');
    const currency = '$';
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    console.log(cartData);

    const getUserCart = async () => {
        const token = localStorage.getItem('token');  
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User is not logged in or userId is not set.');
            return;
        }
        try {
            const response = await axios.get(`${backendurl}/api/Carts/${userId}`, {
                headers: { token },
            });
            if (response.data.success) {
                const cartData = Array.isArray(response.data.cartData) ? response.data.cartData : [];
                setCartData(cartData);
                console.log(response.data.cartData);
            } else {
                toast.error('Failed to fetch cart data');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'An error occurred while fetching the cart.');
        }
    };

    useEffect(() => {
        getUserCart()
    }, [])

    const getCartCount = () => {
        return cartData.reduce((count, item) => count + item.quantity, 0);
    };

    useEffect(() => {
        setCartCount(getCartCount());
    }, [cartData]);

    const getCartAmount = () => {
        let totalCount = 0;
        return totalCount += cartData.reduce((count, item) => count + item.flower.price * item.quantity, 0)
    }

    const addToCartContext = (newItem) => {
        setCartData((prevData) => {
            const itemIndex = prevData.findIndex(item => item.flower.flowerId === newItem.flower.flowerId);
            if (itemIndex !== -1) {
                const updatedCart = [...prevData];
                updatedCart[itemIndex].quantity += newItem.quantity;
                return updatedCart;
            } else {
                return [...prevData, newItem];
            }
        });
    };

    //All flower 
    const getFlowersData = async () => {
        try {
            const response = await axios.get(backendurl + '/api/Flowers');
            if (response.data.success) {
                setFlowers(response.data.flowers);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }
    useEffect(() => {
        getFlowersData();
    }, []);

    const clearCart = async () => {
        const userId = localStorage.getItem("userId");
        try {
            const response = await axios.delete(backendurl + `/api/Carts/ClearCart/${userId}`);
            if (response.status === 204) {
                setCartData([]);
                console.log('Cart cleared successfully');
            } else {
                console.error('Error clearing cart:', response.data);
            }
        } catch (error) {
            console.error('Error occurred while clearing cart:', error);
        }
    }

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            // getUserCart(localStorage.getItem('token'));
        }
    }, []);

    const value = {
        search, setSearch, showSearch, setShowSearch,
        flowers, navigate, token, setToken, backendurl, currency,
        cartData, setCartData, clearCart, getCartCount, getCartAmount, addToCartContext, cartCount, getUserCart,
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider

//useNavigate: Điều hướng lập trình thông qua JavaScript, không cần JSX.
//Link: Điều hướng thông qua JSX, đơn giản giống như thẻ <a>.
//NavLink: Điều hướng và cung cấp thêm tính năng "active" khi đường dẫn trùng khớp với URL hiện tại.