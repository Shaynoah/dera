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
            entry.target.classList.add('animate-in')
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
    <div ref={formRef} className="contact-form-container">
      <div className="form-header">
        <div className="form-header-icon">
          <i className="fas fa-paper-plane"></i>
        </div>
        <h2 className="form-title">Send us a Message</h2>
        <p className="form-subtitle">Fill out the form below and we'll get back to you as soon as possible</p>
      </div>
      <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group modern-input">
            <div className="input-wrapper">
              <i className="input-icon fas fa-user"></i>
              <input 
                type="text" 
                id="firstName" 
                name="firstName" 
                placeholder=" " 
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
              <label htmlFor="firstName">First Name</label>
              <span className="input-border"></span>
            </div>
          </div>
          <div className="form-group modern-input">
            <div className="input-wrapper">
              <i className="input-icon fas fa-user"></i>
              <input 
                type="text" 
                id="lastName" 
                name="lastName" 
                placeholder=" " 
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
              <label htmlFor="lastName">Last Name</label>
              <span className="input-border"></span>
            </div>
          </div>
        </div>

        <div className="form-group modern-input">
          <div className="input-wrapper">
            <i className="input-icon fas fa-envelope"></i>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder=" " 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <label htmlFor="email">Email Address</label>
            <span className="input-border"></span>
          </div>
        </div>

        <div className="form-group modern-input">
          <div className="input-wrapper">
            <i className="input-icon fas fa-phone"></i>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder=" " 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
            <label htmlFor="phone">Phone Number</label>
            <span className="input-border"></span>
          </div>
        </div>

        <div className="form-group modern-select">
          <div className="select-wrapper">
            <i className="select-icon fas fa-tag"></i>
            <select 
              id="subject" 
              name="subject" 
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select a subject</option>
              <option value="general">General Inquiry</option>
              <option value="order">Order Question</option>
              <option value="product">Product Information</option>
              <option value="delivery">Delivery & Shipping</option>
              <option value="return">Returns & Exchanges</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="subject">Subject</label>
            <span className="select-border"></span>
          </div>
        </div>

        <div className="form-group modern-textarea">
          <div className="textarea-wrapper">
            <i className="textarea-icon fas fa-comment-alt"></i>
            <textarea 
              id="message" 
              name="message" 
              rows="4" 
              placeholder=" " 
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <label htmlFor="message">Your Message</label>
            <span className="textarea-border"></span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-submit modern-submit">
          <span className="btn-content">
            <span>Send Message</span>
            <i className="fas fa-paper-plane"></i>
          </span>
          <div className="btn-shine"></div>
        </button>
      </form>
    </div>
  )
}

export default ContactForm
