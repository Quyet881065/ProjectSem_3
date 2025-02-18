import React, { useState, useContext, useEffect } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import axios from 'axios';  // Ensure axios is imported
import { toast } from 'react-toastify';  // Assuming you are using react-toastify for error messages

const Cart = () => {
  const { currency, navigate, backendurl,  cartData, setCartData, getUserCart } = useContext(ShopContext);
  
  const handleInputChange = (e, itemId) => {
    const value = Number(e.target.value);
    if (value > 0) {
      updateQuantity(itemId, value);
    } else {
      updateQuantity(itemId, 0);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const token = localStorage.getItem('token');
    try {
      if (newQuantity === 0) {
        const response = await axios.delete(`${backendurl}/api/Carts/${itemId}`, { headers: { token } });
        if (response.status === 204) {
          console.log('Item deleted successfully');
          getUserCart();
        } else {
          console.error('Error deleting item:', response.data);
        }
      } else {
        const response = await axios.put(
          `${backendurl}/api/Carts`,
          [{ cartId: itemId, quantity: newQuantity }],
          {
            headers: { token },
          }
        );
        if (response.status === 204) {
          console.log('Quantity updated successfully');
          getUserCart();  // Refresh cart after update
        } else {
          console.error('Error updating quantity:', response.data);
        }
      }
    } catch (error) {
      console.error('Error occurred while updating/deleting cart item:', error);
    }
  };


  return (
    <div className="border-t pt-10">
      <div className="text-2xl mb-5">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>
      <div>
        {cartData.length > 0 ? (
          cartData.map((item, index) => {
            return (
              <div
                key={index}
                className="border-t border-b py-5 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-5"
              >
                <div className="flex items-start gap-6">
                  {item.flower ? (
                    <img
                      src={item.flower.image}
                      alt={item.flower.flowerName}
                      className="w-16 sm:w-20"
                    />
                  ) : (
                    <div className="w-16 sm:w-20 bg-gray-200">No Image</div>
                  )}
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {item.flower ? item.flower.flowerName : 'Unknown Flower'}
                    </p>
                    <p>
                      Price: {currency}
                      {item.flower ? item.flower.price : 'N/A'}
                    </p>
                  </div>
                </div>
                <input
                  onChange={(e) => handleInputChange(e, item.cartId)}
                  type="number"
                  min={1}
                  value={item.quantity}
                  className="border max-w-10 sm:max-w-20 py-1 sm:px-2 px-1"
                />
                <img
                  onClick={() => updateQuantity(item.cartId, 0)}
                  className="w-5 sm:w-6 cursor-pointer"
                  src={assets.bin_icon}
                  alt=""
                />
              </div>
            );
          })
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[500px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate('place-order')}
              className="bg-black text-white text-sm px-8 py-3 my-8"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
