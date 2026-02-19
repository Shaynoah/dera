import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import './OrderModal.css'

const OrderModal = ({ onClose, cartItems, total }) => {
  const { clearCart } = useCart()
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    let orderMessage = `*New Order from Dera Drip Website*\n\n`
    orderMessage += `*Customer Details:*\n`
    orderMessage += `Name: ${formData.customerName}\n`
    orderMessage += `Phone: ${formData.customerPhone}\n`
    orderMessage += `Address: ${formData.customerAddress}\n\n`
    orderMessage += `*Order Items:*\n`
    
    cartItems.forEach(item => {
      orderMessage += `${item.name} x${item.quantity} - KSh ${(item.price * item.quantity).toLocaleString()}\n`
    })
    
    orderMessage += `\n*Total: KSh ${total.toLocaleString()}*`

    const encodedMessage = encodeURIComponent(orderMessage)
    const whatsappUrl = `https://wa.me/254700456049?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')
    clearCart()
    onClose()
  }

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>
        <h2>Place Your Order</h2>
        <form id="orderForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customerName">Your Name</label>
            <input 
              type="text" 
              id="customerName" 
              value={formData.customerName}
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerPhone">Phone Number</label>
            <input 
              type="tel" 
              id="customerPhone" 
              value={formData.customerPhone}
              onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="customerAddress">Delivery Address</label>
            <textarea 
              id="customerAddress" 
              rows="3" 
              value={formData.customerAddress}
              onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
              required
            ></textarea>
          </div>
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="order-summary-item">
                <span>{item.name} x{item.quantity}</span>
                <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="order-summary-item total">
              <span>Total</span>
              <span>KSh {total.toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Confirm Order</button>
        </form>
      </div>
    </div>
  )
}

export default OrderModal
