import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { getToken } from "../service/localStorageService";
import { flowersData } from "../features/product/data/flowersData";
import { httpClient } from "../configuration/httpClient";
import { API } from "../configuration/configuration";

export const ShopContext = createContext();

const ShopContextProvider = props => {
    const backendurl = import.meta.env.VITE_API_GATEWAY;
    const [search, setSearch] = useState('')
    const [showSearch, setShowSearch] = useState(false);
    const [flowers, setFlowers] = useState([]);
    const [token, setToken] = useState(getToken() || null);
    const [userProfile, setUserProfile] = useState(null);
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    // https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}

    // useEffect(() => {
    //     const savedToken = localStorage.getItem("accessToken");
    //     if (savedToken) {
    //         setToken(savedToken);
    //     }
    // }, []);

    // const getMyInfo = async () => {
    //     const response = await httpClient.get(API.MY_INFO, {
    //         headers: {
    //             Authorization: `Bearer ${getToken()}`
    //         }
    //     })
    //     const data = response.data;
    //     setUserProfile(data.results);
    //     console.log("User Details:", data);
    //     const userId = data.results.id;
    // }
    useEffect(() => {
        const getMyInfo = async () => {
            if (!token) {
                console.warn("No token found. User not logged in.");
                return;
            }
            try {
                const response = await httpClient.get(API.MY_INFO, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const data = response.data?.results;
                if (data) {
                    setUserProfile(data);
                    // Kiểm tra cả 2 trường hợp: userid hoặc id (tùy backend trả về)
                    setUserId(data?.userid);
                    console.log("User Details:", data);
                    console.log("UserID:", data.userid);
                } else {
                    console.error("No user info returned from API.");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                toast.error("Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!");
            }
        }
        getMyInfo();
    }, [])

    console.log("UserID in ShopContextProvider:", userId);
    const getUserCart = async () => {
        if (!userId) {
            console.error('User is not logged in or userId is not set.');
            return;
        }
        try {
            const response = await axios.get(`${backendurl}/cart/${userId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                }
            });
            if (response.data.results) {
                // const data = Array.isArray(response.data.results) ? response.data.results : [];
                setCart(response.data.results);
                console.log(response.data.results);
                setCartData(response.data.results.items);
            } else {
                toast.error('Failed to fetch cart data');
            }
        } catch (error) {
            console.log(error);
            // toast.error(error.message || 'An error occurred while fetching the cart.');
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
    }, []);


    //All flower 
    const getFlowersData = async () => {
        try {
            const response = await axios.get(backendurl + '/flowers',
                //     {
                //     headers: {
                //         Authorization: `Bearer ${getToken()}`,
                //     }
                // }
            );
            if (response.data.results) {
                setFlowers(response.data.results);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getFlowersData();
    }, []);


    console.log(flowers);

    const clearCart = async () => {
        try {
            const response = await axios.delete(backendurl + `/cart/clear/${userId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            if (response.status === 200) {
                setCart([]);
                console.log('Cart cleared successfully');
            } else {
                console.error('Error clearing cart:', response.data);
            }
        } catch (error) {
            console.error('Error occurred while clearing cart:', error);
        }
    }

    //  Add to Cart
    const addToCart = async (flowerId, quantity) => {
        const token = getToken();
        if (!token) {
            toast.error('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        if (!userId) {
            toast.error('User ID not found. Please try again.');
            return;
        }
        try {
            const cartItem = {
                userId: userId,
                flowerId: flowerId,
                quantity: quantity,
            };
            console.log("AddToCart:", cartItem);

            const response = await axios.post(`${backendurl}/cart/create`, cartItem, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (response.data) {
                toast.success('Added to cart successfully!');
                await getUserCart(); // Cập nhật giỏ hàng
            } else {
                toast.error('Failed to add to cart.');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            toast.error('Error occurred while adding item to cart.');
        }
    };

    const value = {
        search, setSearch, showSearch, setShowSearch, userId, loading,
        flowers, navigate, token, setToken, backendurl, userProfile, setUserProfile, cart, setCart,
        clearCart, getCartCount, cartCount, getUserCart, addToCart, setUserId
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