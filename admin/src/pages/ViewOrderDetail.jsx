
import React from 'react'
import { useParams } from 'react-router-dom'

const ViewOrderDetail = () => {
  const {orderId} = useParams();
  return (
    <div>
       <h2>Order Details for Order ID: {orderId}</h2>
    </div>
  )
}

export default ViewOrderDetail