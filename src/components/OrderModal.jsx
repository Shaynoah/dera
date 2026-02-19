import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import './OrderModal.css'

const OrderModal = ({ onClose, cartItems, total }) => {
  const { clearCart } = useCart()
  const [formData, setFormData] = useState({
    email: '',
    country: 'Kenya',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    shippingMethod: '',
    billingAddress: '',
    deliveryPointLocation: ''
  })

  const [errors, setErrors] = useState({})
  const [showPayment, setShowPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [mpesaNumber, setMpesaNumber] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Enter an email'
    if (!formData.firstName) newErrors.firstName = 'Enter a first name'
    if (!formData.lastName) newErrors.lastName = 'Enter a last name'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePayNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('Pay now clicked', formData)
    
    const isValid = validateForm()
    console.log('Form valid:', isValid, errors)
    
    if (!isValid) {
      // Scroll to first error
      const firstError = document.querySelector('.error')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstError.focus()
      }
      return
    }
    
    setShowPayment(true)
  }

  const handleProceed = () => {
    if (!paymentMethod) {
      alert('Please select a payment method')
      return
    }
    
    if (paymentMethod === 'mpesa' && !mpesaNumber) {
      alert('Please enter your M-PESA mobile number')
      return
    }
    
    if (paymentMethod === 'airtel' && !mpesaNumber) {
      alert('Please enter your Airtel Money mobile number')
      return
    }

    // Submit order
    let orderMessage = `*New Order from Dera Drip Website*\n\n`
    orderMessage += `*Customer Details:*\n`
    orderMessage += `Email: ${formData.email}\n`
    orderMessage += `Name: ${formData.firstName} ${formData.lastName}\n`
    orderMessage += `Phone: ${formData.phone}\n`
    orderMessage += `Address: ${formData.address}\n`
    if (formData.city) orderMessage += `City: ${formData.city}\n`
    if (formData.postalCode) orderMessage += `Postal Code: ${formData.postalCode}\n`
    orderMessage += `Payment Method: ${paymentMethod === 'mpesa' ? 'M-PESA' : 'Airtel Money'}\n`
    if (mpesaNumber) orderMessage += `Mobile Number: ${mpesaNumber}\n`
    orderMessage += `\n*Order Items:*\n`
    
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
    <div className="checkout-modal active" onClick={onClose}>
      <div className="checkout-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-checkout" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        {!showPayment ? (
          <div className="checkout-container">
            {/* Left Side - Form */}
            <div className="checkout-form-section">
              <form id="checkoutForm">
              {/* Contact Section */}
              <div className="checkout-section">
                <h2 className="section-title">Contact</h2>
                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              {/* Delivery Section */}
              <div className="checkout-section">
                <h2 className="section-title">Delivery</h2>
                
                <div className="form-field">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="Kenya">Kenya</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                      placeholder="First name"
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>
                  <div className="form-field">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                      placeholder="Last name"
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-field">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </div>

                <div className="form-field">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-field">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal code (optional)"
                  />
                </div>

                <div className="form-field phone-field">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                  />
                  <span className="flag-icon">🇰🇪</span>
                </div>
              </div>

              {/* Shipping Method Section */}
              <div className="checkout-section">
                <h2 className="section-title">Shipping method</h2>
                <div className="shipping-option">
                  <label className="shipping-option-label">
                    <input
                      type="checkbox"
                      name="shippingMethod"
                      value="hq-pickup"
                      checked={formData.shippingMethod === 'hq-pickup'}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          shippingMethod: e.target.checked ? 'hq-pickup' : ''
                        })
                      }}
                    />
                    <div className="shipping-option-content">
                      <span className="shipping-option-text">HQ Pick Up: Diamond building Unit G10 Next to Bihi towers moi avenue</span>
                      <span className="shipping-option-price">FREE</span>
                    </div>
                  </label>
                </div>
                <div className="shipping-option">
                  <label className="shipping-option-label">
                    <input
                      type="checkbox"
                      name="shippingMethod"
                      value="delivery-point"
                      checked={formData.shippingMethod === 'delivery-point'}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          shippingMethod: e.target.checked ? 'delivery-point' : ''
                        })
                      }}
                    />
                    <div className="shipping-option-content">
                      <span className="shipping-option-text">Choose preferred delivery point</span>
                    </div>
                  </label>
                </div>
                {formData.shippingMethod === 'delivery-point' && (
                  <div className="form-field" style={{ marginTop: '1rem' }}>
                    <input
                      type="text"
                      name="deliveryPointLocation"
                      value={formData.deliveryPointLocation}
                      onChange={handleChange}
                      placeholder="Enter your preferred delivery location"
                    />
                  </div>
                )}
              </div>

              {/* Billing Address Section */}
              <div className="checkout-section">
                <h2 className="section-title">Billing address</h2>
                <div className="billing-option">
                  <label className="billing-option-label">
                    <input
                      type="checkbox"
                      name="billingAddress"
                      value="same"
                      checked={formData.billingAddress === 'same'}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          billingAddress: e.target.checked ? 'same' : ''
                        })
                      }}
                    />
                    <span className="billing-option-text">Same as shipping address</span>
                  </label>
                </div>
              </div>

              {/* Pay Now Button */}
              <button 
                type="button" 
                onClick={(e) => {
                  console.log('Button clicked')
                  handlePayNow(e)
                }}
                className="pay-now-btn"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                Pay now
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="checkout-summary-section">
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image-wrapper">
                    <img src={item.image} alt={item.name} />
                    <span className="item-quantity">{item.quantity}</span>
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-price">Ksh {(item.price * item.quantity).toLocaleString()}.00</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-breakdown">
              <div className="breakdown-row">
                <span>Subtotal</span>
                <span>Ksh {total.toLocaleString()}.00</span>
              </div>
              <div className="breakdown-row">
                <span>
                  Shipping
                  <i className="fas fa-info-circle info-icon"></i>
                </span>
                <span>FREE</span>
              </div>
              <div className="breakdown-row total-row">
                <span>Total</span>
                <span>KES Ksh {total.toLocaleString()}.00</span>
              </div>
            </div>
          </div>
        </div>
        ) : (
          /* Payment Page */
          <div className="payment-page-container">
            <div className="payment-page-left">
              <div className="breadcrumb">
                <a href="#" onClick={(e) => { e.preventDefault(); setShowPayment(false); }}>Cart</a>
              </div>
              
              <div className="payment-section-full">
                <h2 className="section-title">Please select your preferred payment option</h2>
                
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <span className="payment-logo mpesa-logo">M-PESA</span>
                      <span className="payment-name">M-PESA</span>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'airtel' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="airtel"
                      checked={paymentMethod === 'airtel'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-option-content">
                      <span className="payment-logo airtel-logo">Airtel Money</span>
                      <span className="payment-name">Airtel Money</span>
                    </div>
                  </label>
                </div>

                {paymentMethod && (
                  <div className="payment-instructions">
                    <p className="payment-amount">Pay "Dera Drip" KES {total.toLocaleString()}.00</p>
                    
                    {paymentMethod === 'mpesa' && (
                      <div className="mpesa-instructions">
                        <p>1. Provide your MPESA [KE] mobile number below</p>
                        <p>2. Click Proceed and a prompt will appear on your phone requesting you to confirm transaction by providing your MPESA PIN</p>
                        <p>3. Once completed, you will receive the confirmation SMS for this transaction</p>
                      </div>
                    )}

                    {paymentMethod === 'airtel' && (
                      <div className="mpesa-instructions">
                        <p>1. Provide your Airtel Money [KE] mobile number below</p>
                        <p>2. Click Proceed and a prompt will appear on your phone requesting you to confirm transaction by providing your Airtel Money PIN</p>
                        <p>3. Once completed, you will receive the confirmation SMS for this transaction</p>
                      </div>
                    )}

                    <div className="mobile-number-field">
                      <i className="fas fa-lock lock-icon"></i>
                      <label>Provide your {paymentMethod === 'mpesa' ? 'Mpesa' : 'Airtel Money'} [KE] Mobile number</label>
                      <div className="phone-input-wrapper">
                        <i className="fas fa-phone phone-input-icon"></i>
                        <span className="phone-prefix">+254</span>
                        <input
                          type="tel"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          placeholder="e.g 7XX XXX XXX"
                          className="phone-input"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleProceed}
                      className="proceed-btn"
                    >
                      Proceed
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="payment-page-right">
              <div className="payment-summary">
                <div className="payment-order-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="payment-order-item">
                      <div className="payment-item-image-wrapper">
                        <img src={item.image} alt={item.name} />
                        <span className="payment-item-quantity">{item.quantity}</span>
                      </div>
                      <div className="payment-item-details">
                        <div className="payment-item-name">{item.name}</div>
                        <div className="payment-item-price">Ksh {(item.price * item.quantity).toLocaleString()}.00</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="summary-section">
                  <h3>Customer Details</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.email}</p>
                </div>

                <div className="summary-section">
                  <h3>Shipping details</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.email}</p>
                  {formData.shippingMethod === 'hq-pickup' && (
                    <p>Diamond building Unit G10 Next to Bihi towers moi avenue</p>
                  )}
                  {formData.shippingMethod === 'delivery-point' && (
                    <p>{formData.deliveryPointLocation || 'Preferred delivery point'}</p>
                  )}
                  {formData.shippingMethod !== 'hq-pickup' && formData.shippingMethod !== 'delivery-point' && formData.address && (
                    <>
                      <p>{formData.address}</p>
                      <p>{formData.city ? formData.city.toUpperCase() : 'NAIROBI'}, Kenya</p>
                    </>
                  )}
                </div>

                <div className="summary-total">
                  <span>Total Amount</span>
                  <span className="total-amount">KES {total.toLocaleString()}.00</span>
                </div>

                <button 
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="cancel-btn"
                >
                  &lt;&lt; Cancel / Go Back to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderModal
