import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import OrderModal from './OrderModal'
import './CartSidebar.css'

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const { cartItems, removeFromCart, updateQuantity, getTotal } = useCart()

  useEffect(() => {
    const handleCartToggle = () => {
      setIsOpen(prev => !prev)
    }

    const cartBtn = document.getElementById('cartBtn')
    if (cartBtn) {
      cartBtn.addEventListener('click', handleCartToggle)
    }

    // Listen for sidebar state changes from DOM
    const observer = new MutationObserver(() => {
      const sidebar = document.querySelector('.cart-sidebar')
      if (sidebar) {
        setIsOpen(sidebar.classList.contains('active'))
      }
    })

    const sidebar = document.querySelector('.cart-sidebar')
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] })
    }

    return () => {
      if (cartBtn) {
        cartBtn.removeEventListener('click', handleCartToggle)
      }
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const sidebar = document.querySelector('.cart-sidebar')
    const overlay = document.querySelector('.cart-overlay')
    if (sidebar) {
      if (isOpen) {
        sidebar.classList.add('active')
        if (overlay) overlay.classList.add('active')
      } else {
        sidebar.classList.remove('active')
        if (overlay) overlay.classList.remove('active')
      }
    }
  }, [isOpen])

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setShowOrderModal(true)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const total = getTotal()

  return (
    <>
      <div className="cart-overlay" onClick={handleClose}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">KSh {(item.price * item.quantity).toLocaleString()}</div>
                  <div className="cart-item-actions">
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span className="quantity">{item.quantity}</span>
                    <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="remove-item" onClick={() => removeFromCart(item.id)} title="Remove">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total: KSh {total.toLocaleString()}</span>
          </div>
          <button 
            className="btn btn-primary btn-block" 
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Place Order
          </button>
        </div>
      </div>
      {showOrderModal && (
        <OrderModal 
          onClose={() => {
            setShowOrderModal(false)
            setIsOpen(false)
          }} 
          cartItems={cartItems}
          total={total}
        />
      )}
    </>
  )
}

export default CartSidebar
