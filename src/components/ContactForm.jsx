import React, { useState, useEffect, useRef } from 'react'
import './ContactForm.css'

const ContactForm = () => {
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (formRef.current) {
      observer.observe(formRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    let whatsappMessage = `*New Contact Form Submission*\n\n`
    whatsappMessage += `*Name:* ${formData.firstName} ${formData.lastName}\n`
    whatsappMessage += `*Email:* ${formData.email}\n`
    whatsappMessage += `*Phone:* ${formData.phone}\n`
    whatsappMessage += `*Subject:* ${formData.subject}\n\n`
    whatsappMessage += `*Message:*\n${formData.message}`

    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/254700456049?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div ref={formRef} className="contact-form">
      <div className="contact-form-header">
        <div className="contact-form-icon">
          <i className="fas fa-paper-plane"></i>
        </div>
        <h2 className="contact-form-title">Send us a Message</h2>
        <p className="contact-form-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>
      </div>
      <form id="contactForm" className="contact-form-form" onSubmit={handleSubmit}>
        <div className="contact-form-row">
          <div className="contact-form-field">
            <div className="contact-form-field-wrapper">
              <i className="fas fa-user contact-form-icon-input"></i>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                placeholder=" " 
                value={formData.firstName}
                onChange={handleChange}
                required 
                className="contact-form-input"
              />
              <label htmlFor="firstName" className="contact-form-label">First Name</label>
              <span className="contact-form-underline"></span>
            </div>
          </div>
          <div className="contact-form-field">
            <div className="contact-form-field-wrapper">
              <i className="fas fa-user contact-form-icon-input"></i>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                placeholder=" " 
                value={formData.lastName}
                onChange={handleChange}
                required 
                className="contact-form-input"
              />
              <label htmlFor="lastName" className="contact-form-label">Last Name</label>
              <span className="contact-form-underline"></span>
            </div>
          </div>
        </div>

        <div className="contact-form-field">
          <div className="contact-form-field-wrapper">
            <i className="fas fa-envelope contact-form-icon-input"></i>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder=" " 
              value={formData.email}
              onChange={handleChange}
              required 
              className="contact-form-input"
            />
            <label htmlFor="email" className="contact-form-label">Email Address</label>
            <span className="contact-form-underline"></span>
          </div>
        </div>

        <div className="contact-form-field">
          <div className="contact-form-field-wrapper">
            <i className="fas fa-phone contact-form-icon-input"></i>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder=" " 
              value={formData.phone}
              onChange={handleChange}
              required 
              className="contact-form-input"
            />
            <label htmlFor="phone" className="contact-form-label">Phone Number</label>
            <span className="contact-form-underline"></span>
          </div>
        </div>

        <div className="contact-form-field">
          <div className="contact-form-field-wrapper contact-form-select-wrapper">
            <i className="fas fa-tag contact-form-icon-input"></i>
            <select 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              required
              className="contact-form-select"
            >
              <option value="" disabled>Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="order">Order Question</option>
              <option value="product">Product Information</option>
              <option value="delivery">Delivery & Shipping</option>
              <option value="return">Returns & Exchanges</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="subject" className="contact-form-label">Subject</label>
            <div className="contact-form-select-arrow">
              <i className="fas fa-chevron-down"></i>
            </div>
            <span className="contact-form-underline"></span>
          </div>
        </div>

        <div className="contact-form-field">
          <div className="contact-form-field-wrapper">
            <i className="fas fa-comment-alt contact-form-icon-input contact-form-field-icon-textarea"></i>
            <textarea 
              id="message" 
              name="message" 
              rows="4" 
              placeholder=" " 
              value={formData.message}
              onChange={handleChange}
              required
              className="contact-form-textarea"
            ></textarea>
            <label htmlFor="message" className="contact-form-label">Your Message</label>
            <span className="contact-form-underline"></span>
          </div>
        </div>

        <button type="submit" className="contact-form-submit">
          <span className="contact-form-submit-content">
            <span>Send Message</span>
            <i className="fas fa-paper-plane contact-form-submit-icon"></i>
          </span>
        </button>
      </form>
    </div>
  )
}

export default ContactForm
