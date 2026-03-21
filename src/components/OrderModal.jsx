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
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="order-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        {!showPayment ? (
          <div className="order-modal-grid">
            {/* Left Side - Form */}
            <div className="order-modal-form-section">
              <form id="checkoutForm">
              {/* Contact Section */}
              <div className="order-modal-section">
                <h2 className="order-modal-section-title">Contact</h2>
                <div className="mb-4 relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`order-modal-input ${errors.email ? 'order-modal-input-error' : ''}`}
                    placeholder="Email"
                  />
                  {errors.email && <span className="order-modal-error">{errors.email}</span>}
                </div>
              </div>

              {/* Delivery Section */}
              <div className="order-modal-section">
                <h2 className="order-modal-section-title">Delivery</h2>
                
                <div className="mb-4 relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="order-modal-select"
                  >
                    <option value="Kenya">Kenya</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                  <div className="mb-4 relative">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`order-modal-input ${errors.firstName ? 'order-modal-input-error' : ''}`}
                      placeholder="First name"
                    />
                    {errors.firstName && <span className="order-modal-error">{errors.firstName}</span>}
                  </div>
                  <div className="mb-4 relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`order-modal-input ${errors.lastName ? 'order-modal-input-error' : ''}`}
                      placeholder="Last name"
                    />
                    {errors.lastName && <span className="order-modal-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="mb-4 relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="order-modal-input"
                    placeholder="Address"
                  />
                </div>

                <div className="mb-4 relative">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="order-modal-input"
                    placeholder="City"
                  />
                </div>

                <div className="mb-4 relative">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="order-modal-input"
                    placeholder="Postal code (optional)"
                  />
                </div>

                <div className="mb-4 relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="order-modal-input"
                    placeholder="Phone"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[1.2rem] pointer-events-none">🇰🇪</span>
                </div>
              </div>

              {/* Shipping Method Section */}
              <div className="order-modal-section">
                <h2 className="order-modal-section-title">Shipping method</h2>
                <div className="order-modal-checkbox-group">
                  <label className="order-modal-checkbox-label">
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
                      className="order-modal-checkbox"
                    />
                    <div className="order-modal-checkbox-content">
                      <span className="order-modal-checkbox-text">HQ Pick Up: Diamond building Unit G10 Next to Bihi towers moi avenue</span>
                      <span className="order-modal-checkbox-price">FREE</span>
                    </div>
                  </label>
                </div>
                <div className="order-modal-checkbox-group">
                  <label className="order-modal-checkbox-label">
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
                      className="order-modal-checkbox"
                    />
                    <div className="order-modal-checkbox-content">
                      <span className="order-modal-checkbox-text">Choose preferred delivery point</span>
                    </div>
                  </label>
                </div>
                {formData.shippingMethod === 'delivery-point' && (
                  <div className="mb-4 relative mt-4">
                    <input
                      type="text"
                      name="deliveryPointLocation"
                      value={formData.deliveryPointLocation}
                      onChange={handleChange}
                      className="order-modal-input"
                      placeholder="Enter your preferred delivery location"
                    />
                  </div>
                )}
              </div>

              {/* Billing Address Section */}
              <div className="order-modal-section">
                <h2 className="order-modal-section-title">Billing address</h2>
                <div className="order-modal-billing-group">
                  <label className="order-modal-checkbox-label">
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
                      className="order-modal-checkbox"
                    />
                    <span className="order-modal-checkbox-text">Same as shipping address</span>
                  </label>
                </div>
              </div>

              {/* Pay Now Button - Desktop */}
              <button 
                type="button" 
                onClick={(e) => {
                  console.log('Button clicked')
                  handlePayNow(e)
                }}
                className="order-modal-pay-btn order-modal-pay-btn-desktop"
                style={{ pointerEvents: 'auto', zIndex: 10 }}
              >
                Pay now
              </button>
            </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-modal-summary">
            <div className="mb-8">
              {cartItems.map(item => (
                <div key={item.id} className="order-modal-item">
                  <div className="order-modal-item-image">
                    <img src={item.image} alt={item.name} />
                    <span className="order-modal-item-badge">{item.quantity}</span>
                  </div>
                  <div className="order-modal-item-details">
                    <div className="order-modal-item-name">{item.name}</div>
                    <div className="order-modal-item-price">Ksh {(item.price * item.quantity).toLocaleString()}.00</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-modal-summary-divider">
              <div className="order-modal-summary-row">
                <span>Subtotal</span>
                <span>Ksh {total.toLocaleString()}.00</span>
              </div>
              <div className="order-modal-summary-row">
                <span>
                  Shipping
                  <i className="fas fa-info-circle ml-2 text-[#9ca3af] text-[0.85rem] cursor-help"></i>
                </span>
                <span>FREE</span>
              </div>
              <div className="order-modal-summary-total">
                <span>Total</span>
                <span>KES Ksh {total.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Pay Now Button - Mobile */}
            <button 
              type="button" 
              onClick={(e) => {
                console.log('Button clicked')
                handlePayNow(e)
              }}
              className="order-modal-pay-btn order-modal-pay-btn-mobile"
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            >
              Pay now
            </button>
          </div>
        </div>
        ) : (
          /* Payment Page */
          <div className="order-modal-grid">
            <div className="order-modal-payment-section">
              <div className="order-modal-payment-back">
                <a href="#" onClick={(e) => { e.preventDefault(); setShowPayment(false); }}>Cart</a>
              </div>
              
              <div className="mt-4">
                <h2 className="order-modal-section-title">Please select your preferred payment option</h2>
                
                <div className="flex flex-col gap-4 mb-8">
                  <label className={`order-modal-payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="order-modal-payment-radio"
                    />
                    <div className="order-modal-payment-content">
                      <span className="order-modal-payment-badge order-modal-payment-badge-mpesa">M-PESA</span>
                      <span className="order-modal-payment-name">M-PESA</span>
                    </div>
                  </label>

                  <label className={`order-modal-payment-option ${paymentMethod === 'airtel' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="airtel"
                      checked={paymentMethod === 'airtel'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="order-modal-payment-radio"
                    />
                    <div className="order-modal-payment-content">
                      <span className="order-modal-payment-badge order-modal-payment-badge-airtel">Airtel Money</span>
                      <span className="order-modal-payment-name">Airtel Money</span>
                    </div>
                  </label>
                </div>

                {paymentMethod && (
                  <div className="mt-8">
                    <p className="order-modal-payment-amount">Pay "Dera Drip" KES {total.toLocaleString()}.00</p>
                    
                    {paymentMethod === 'mpesa' && (
                      <div className="order-modal-payment-instructions">
                        <p>1. Provide your MPESA [KE] mobile number below</p>
                        <p>2. Click Proceed and a prompt will appear on your phone requesting you to confirm transaction by providing your MPESA PIN</p>
                        <p>3. Once completed, you will receive the confirmation SMS for this transaction</p>
                      </div>
                    )}

                    {paymentMethod === 'airtel' && (
                      <div className="order-modal-payment-instructions">
                        <p>1. Provide your Airtel Money [KE] mobile number below</p>
                        <p>2. Click Proceed and a prompt will appear on your phone requesting you to confirm transaction by providing your Airtel Money PIN</p>
                        <p>3. Once completed, you will receive the confirmation SMS for this transaction</p>
                      </div>
                    )}

                    <div className="mb-6">
                      <div className="order-modal-payment-label">
                        <i className="fas fa-lock"></i>
                        <label>Provide your {paymentMethod === 'mpesa' ? 'Mpesa' : 'Airtel Money'} [KE] Mobile number</label>
                      </div>
                      <div className="order-modal-payment-input-wrapper">
                        <i className="fas fa-phone"></i>
                        <span>+254</span>
                        <input
                          type="tel"
                          value={mpesaNumber}
                          onChange={(e) => setMpesaNumber(e.target.value)}
                          placeholder="e.g 7XX XXX XXX"
                          className="order-modal-payment-input"
                        />
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleProceed}
                      className="order-modal-proceed-btn hidden md:block"
                    >
                      Proceed
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="order-modal-summary">
              <div className="flex flex-col gap-8">
                <div className="mb-8 pb-6 border-b border-[#e5e7eb]">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden bg-[#f3f4f6]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 bg-[#1a1a1a] text-white w-6 h-6 rounded-md flex items-center justify-center text-[0.75rem] font-bold border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.2)]">{item.quantity}</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="font-bold text-[#1a1a1a] text-[0.95rem]">{item.name}</div>
                        <div className="text-[#4b5563] text-[0.9rem]">Ksh {(item.price * item.quantity).toLocaleString()}.00</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pb-6 border-b border-[#e5e7eb] last:border-b-0">
                  <h3 className="text-[0.9rem] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wide">Customer Details</h3>
                  <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.firstName} {formData.lastName}</p>
                  <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.email}</p>
                </div>

                <div className="pb-6 border-b border-[#e5e7eb] last:border-b-0">
                  <h3 className="text-[0.9rem] font-semibold text-[#1a1a1a] mb-3 uppercase tracking-wide">Shipping details</h3>
                  <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.firstName} {formData.lastName}</p>
                  <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.email}</p>
                  {formData.shippingMethod === 'hq-pickup' && (
                    <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">Diamond building Unit G10 Next to Bihi towers moi avenue</p>
                  )}
                  {formData.shippingMethod === 'delivery-point' && (
                    <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.deliveryPointLocation || 'Preferred delivery point'}</p>
                  )}
                  {formData.shippingMethod !== 'hq-pickup' && formData.shippingMethod !== 'delivery-point' && formData.address && (
                    <>
                      <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.address}</p>
                      <p className="text-[0.9rem] text-[#4b5563] mb-1 leading-[1.5]">{formData.city ? formData.city.toUpperCase() : 'NAIROBI'}, Kenya</p>
                    </>
                  )}
                </div>

                <div className="flex justify-between items-center py-6 border-t-2 border-[#1a1a1a] border-b-2 border-[#1a1a1a]">
                  <span className="font-semibold text-[#1a1a1a] text-base">Total Amount</span>
                  <span className="font-bold text-[#1a1a1a] text-[1.2rem]">KES {total.toLocaleString()}.00</span>
                </div>

                {/* Proceed Button - Mobile Only */}
                {paymentMethod && (
                  <button 
                    type="button"
                    onClick={handleProceed}
                    className="order-modal-proceed-btn hidden md:block mt-6 mb-4"
                  >
                    Proceed
                  </button>
                )}

                <button 
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="order-modal-proceed-btn mt-4"
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
