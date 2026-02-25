import { useContext, useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import Title from '../../../components/layout/Title'
import CartTotal from './CartTotal'
import { ShopContext } from '../../../context/ShopContext'
import { getToken } from '../../../service/localStorageService'

const PlaceOrder = () => {
    // State for form fields
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [occasionId, setOccasionId] = useState('');
    const [occasions, setOccasions] = useState([]);
    const { backendurl, navigate, clearCart, cart } = useContext(ShopContext);
    const customerId = localStorage.getItem('customerId');

    console.log(cart)
    // Get message
    // useEffect(() => {
    //     const fetchOccasions = async () => {
    //         try {
    //             const response = await axios.get(backendurl + '/api/Messages')
    //             setOccasions(response.data)
    //         } catch (error) {
    //             console.error('Error fetching occasions:', error);
    //         }
    //     }
    //     fetchOccasions()
    // }, [backendurl])


    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !address || !phone) {
            alert('Please fill in all required fields.');
            return;
        }
        //Create order payload
        const orderPayload = {
            userId: cart.userId,
            shippingAddress: address,
            fullName: fullName,
            phone: phone,
            items: cart.items.map(item => ({
                flowerId: item.flowerId,
                quantity: item.quantity,
                price: item.price
            }))
        };
        console.log('Order Payload:', orderPayload);
        try {
            // Create order
            const orderResponse = await axios.post(backendurl + 'orders/create', orderPayload, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            console.log("Order response:", orderResponse.data);
            navigate("orders/" + orderResponse.data.orderId);
            clearCart();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row justify-between pt-5 sm:py-10 border-t'>
            {/* Left Side */}
            <div className='flex flex-col w-full sm:max-w-[480px] gap-5'>
                <div className='text-2xl text-center my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>
                <div className='flex flex-col gap-1 mb-5'>
                    <label>Full Name</label>
                    <input
                        placeholder='Enter your full name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className='border border-gray-200 rounded py-1.5 ' type='text' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label>Address</label>
                    <input
                        placeholder='Enter your address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className='border border-gray-200 rounded py-1.5' type='text' />
                </div>
                <div className='flex flex-col gap-1'>
                    <label>Phone</label>
                    <input
                        placeholder='Enter your phone number'
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)} className='border border-gray-200 rounded py-1.5' type='text' />
                </div>
                {/* <div className='flex flex-col gap-1'>
                    <label>Select Occasion</label>
                    <select className='border border-gray-200 rounded py-1.5' value={occasionId} onChange={e => setOccasionId(e.target.value)}>
                        <option>Select Occasion</option>
                        {occasions.map(occasion => (
                            <option key={occasion.occasionid} value={occasion.occasionid}>{occasion.message1}</option>
                        ))}
                    </select>
                </div> */}
            </div>

            {/* Right Side */}
            <div className='mt-8 '>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>
                {/* <div>
                    <Title text1={'PAYMENT'} text2={'METHOD'} />
                    <div className={`flex items-center gap-3 border p-2 px-4 cursor-pointer ${paymentMethod === 'card' ? 'border-black' : ''}`}
                        onClick={() => setPaymentMethod('card')}>
                        <p className={`min-w-[14px] h-[14px] border rounded-full ${paymentMethod === 'card' ? 'bg-black' : ''}`}></p>
                        <p className='text-gray-500 text-sm font-medium mx-4'>Card Payment Stripe</p>
                    </div>
                    <div
                        className={`flex items-center gap-3 border p-2 px-4 cursor-pointer ${paymentMethod === 'Payment Cash' ? 'border-black' : ''}`}
                        onClick={() => setPaymentMethod('Payment Cash')}
                    >
                        <p className={`min-w-[14px] h-[14px] border rounded-full ${paymentMethod === 'Payment Cash' ? 'bg-black' : ''}`}></p>
                        <p className='text-gray-500 text-sm font-medium mx-4'>Cash on Delivery</p>
                    </div>
                </div> */}
                <div className='w-full text-end mt-8'>
                    <button type='submit' className='bg-blue-500 rounded-md text-gray-50 px-10 py-3 text-sm'>PLACE ORDER</button>
                </div>
            </div>
        </form >
    )
}

export default PlaceOrder