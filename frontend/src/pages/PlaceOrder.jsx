import { useContext, useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'

const PlaceOrder = () => {

    // State for form fields
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [occasionId, setOccasionId] = useState('');
    const [occasions, setOccasions] = useState([]);
    const { backendurl, getCartAmount, navigate, clearCart, cartData } = useContext(ShopContext);
    const customerId = localStorage.getItem('customerId');

    console.log(cartData)
    // Get message
    useEffect(() => {
        const fetchOccasions = async () => {
            try {
                const response = await axios.get(backendurl + '/api/Messages')
                setOccasions(response.data)
            } catch (error) {
                console.error('Error fetching occasions:', error);
            }
        }
        fetchOccasions()
    }, [backendurl])
    console.log(getCartAmount())

    // Ham submit order details
    const handleSubmitOrderDetails = async (orderId) => {
        const orderDetails = cartData.map(item => ({
            orderId: orderId,
            flowerId: item.flower.flowerId,
            quantity: item.quantity,
            price: item.flower.price
        }))
        try {
            const response = await axios.post(backendurl + '/api/OrderDetails', orderDetails)
            if (response.data.success) {
                console.log('Order details successfully submitted:', response.data);
            } else {
                console.error('Failed to submit order details:', response.data);
            }
        } catch (error) {
            console.error('Error submitting order details:', error);
        }
    }

    const handleStripePayment = async (orderId) => {
        try {

            // Create the payment session on the backend
            const response = await axios.post(backendurl + '/api/Payment/create-checkout-session', {
                orderId: orderId,
                amount: getCartAmount(), // Assuming amount is in USD
            });

            // Redirect the user to the Stripe checkout page

            const { url } = response.data;
            if (url) {
                window.location.href = url;
            }
            console.log(url)
            await clearCart();
        } catch (error) {
            console.error('Error with Stripe payment:', error);
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !address || !phone  || !paymentMethod) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create order payload
        const orderPayload = {
            customerId: parseInt(customerId),
            deliveryAddress: address,
            total: getCartAmount(),
            status: 'Order received',
            occasionId: occasionId || null,
        };

        try {
            // Create order
            const orderResponse = await axios.post(backendurl + '/api/Orders', orderPayload);
            const orderId = orderResponse.data.orderId;

            localStorage.setItem('orderId', orderId);

            await handleSubmitOrderDetails(orderId);

            // Create delivery info payload
            const deliveryPayload = {
                orderid: orderId,
                recipientName: fullName,
                recipientAddress: address,
                recipientPhoneNo: phone,
                //deliveryDate: deliveryDate
            };

            await axios.post(backendurl + '/api/DeliveryInfoes', deliveryPayload);

            // Create payment payload
            if (paymentMethod === 'card') {
                await handleStripePayment(orderId);
            } else {
                const paymentPayload = {
                    orderid: orderId,
                    paymentMethod: paymentMethod,
                    paymentAmount: getCartAmount(),
                    paymentStatus: 'Cash On Delivery',
                };
                await axios.post(backendurl + '/api/Payments', paymentPayload);
                navigate(`/orders/${orderId}`);
                clearCart();
            }
        } catch (error) {
            console.error('Error placing order', error);
            alert('Failed to place order');
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
                <div className='flex flex-col gap-1'>
                    <label>Select Occasion</label>
                    <select className='border border-gray-200 rounded py-1.5' value={occasionId} onChange={e => setOccasionId(e.target.value)}>
                        <option>Select Occasion</option>
                        {occasions.map(occasion => (
                            <option key={occasion.occasionid} value={occasion.occasionid}>{occasion.message1}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Right Side */}
            <div className='mt-8 '>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>
                <div>
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
                </div>
                <div className='w-full text-end mt-8'>
                    <button type='submit' className='bg-blue-500 rounded-md text-gray-50 px-10 py-3 text-sm'>PLACE ORDER</button>
                </div>
            </div>
        </form >
    )
}

export default PlaceOrder