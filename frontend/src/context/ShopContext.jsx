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
    const [cartItems, setCartItems] = useState([]);
    
    console.log("flowers from context:", flowers);
    // Add cart 
    const addToCart = async (itemId, quantity = 1, flowerData) => {
        setCartItems((prevItems) => {
            const updatedCartItems = [...prevItems]; // Sao chép mảng hiện tại
            const existingItemIndex = updatedCartItems.findIndex(item => item.itemId === itemId);
            console.log(existingItemIndex);
            if (existingItemIndex >= 0) {
                // Nếu item đã có trong giỏ hàng, cập nhật số lượng
                updatedCartItems[existingItemIndex].quantity += quantity;
            } else {
                // Nếu item chưa có, thêm mới vào giỏ hàng
                updatedCartItems.push({
                    itemId,
                    flowerData,
                    quantity
                });
            }
            return updatedCartItems;
        });
        const userId = localStorage.getItem('userId');
        if (token) {
            try {
                const cartItem = {
                    UserId: userId,  // Include UserId in the payload
                    FlowerId: flowerData.flowerId,
                    Quantity: quantity
                };
                await axios.post(backendurl + '/api/Carts', cartItem, {
                    headers: { token }
                });
            } catch (error) {
                console.log(error);
            }
        }
    };
    
    // update count icon cart
    const getCartCount = () => {
        let totalCount = 0;
        if (Array.isArray(cartItems)) {  // Kiểm tra nếu cartItems là một mảng
            for (const item of cartItems) {
                try {
                    if (item.quantity > 0) {
                        totalCount += item.quantity;
                    }
                } catch (error) {
                    console.error("Error counting item quantity", error);
                }
            }
        } else {
            console.error("cartItems is not iterable or undefined");
        }
        return totalCount;
    }

    // Total price cart  
    const getCartAmount = () => {
        let total = 0;
        for (const items of cartItems) {
            //for...of lặp qua các giá trị của một mảng hoặc đối tượng có thể lặp (iterable)
            if (items.flower && items.flower.price) {
                total += items.flower.price * items.quantity;
            } else {
                console.warn('Missing flower data or price for item:', items);
            }
        }
        return total;
    }

    // Update cart and delete cart
    const updateQuantity = async (itemId, newQuantity) => {
        try {
            if (newQuantity === 0) {
                const response = await axios.delete(`${backendurl}/api/Carts/${itemId}`, { headers: { token } });  
                if (response.status === 204) {
                    console.log('Item deleted successfully');
                } else {
                    console.error('Error deleting item:', response.data);
                }
            } else {
                const response = await axios.put(`${backendurl}/api/Carts`, [{ cartId: itemId, quantity: newQuantity }], {
                    headers: { token },
                });   
                if (response.status === 204) {
                    console.log('Quantity updated successfully');
                } else {
                    console.error('Error updating quantity:', response.data);
                }
            }
        } catch (error) {
            console.error('Error occurred while updating/deleting cart item:', error);
        }
    };

   //All flower 
    const getFlowersData = async () => {
        try {
            const response = await axios.get(backendurl + '/api/Flowers');
            if (response.data.success) {
                setFlowers(response.data.flowers);
               // console.log(response.data.flowers);
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // get cart user 
    const getUserCart = async (token) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User is not logged in or userId is not set.");
            return; 
        }
        try {
            const response = await axios.get(backendurl + `/api/Carts/${userId}`, {
                headers: { token }
            });
            if (response.data.success) {
                const cartData = Array.isArray(response.data.cartData) ? response.data.cartData : [];
                setCartItems(cartData); 
                console.log(response.data.cartData);
            } else {
                toast.error("Failed to fetch cart data");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || "An error occurred while fetching the cart.");
        }
    };

    const clearCart = async()=>{
       const userId = localStorage.getItem("userId");
       try { 
         const response = await axios.delete(backendurl + `/api/Carts/ClearCart/${userId}`);
         if(response.status === 204){
            setCartItems([]);
            console.log('Cart cleared successfully');
         }else{
            console.error('Error clearing cart:', response.data);
         }
       } catch (error) {
        console.error('Error occurred while clearing cart:', error);
       }
    }

    useEffect(() => {
        getFlowersData();
      }, []);

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    },[]);

    const value = {
        search, setSearch, showSearch, setShowSearch,
        flowers, navigate, token, setToken, backendurl, currency,
        addToCart, getCartCount, cartItems, setCartItems, getCartAmount, 
        updateQuantity, clearCart
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