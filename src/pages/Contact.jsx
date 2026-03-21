import React, { useEffect, useState } from 'react'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    let whatsappMessage = `*New Contact Form Submission*\n\n`
    whatsappMessage += `*Name:* ${formData.name}\n`
    whatsappMessage += `*Email:* ${formData.email}\n`
    whatsappMessage += `*Phone:* ${formData.phone}\n\n`
    whatsappMessage += `*Message:*\n${formData.message}`

    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/254700456049?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    })
  }

  return (
    <div className="contact-page">
      {/* Main Contact Section */}
      <section className="contact-section">
        <div className="contact-grid">
          {/* Left Side - Contact Info */}
          <div className="contact-info">
            <div className="contact-card">
              <div className="contact-card-content">
                <div className="contact-card-icon contact-card-icon-whatsapp">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div className="contact-card-text">
                  <h3 className="contact-card-title">WhatsApp</h3>
                  <p className="contact-card-description">Chat with us instantly</p>
                </div>
                <a 
                  href="https://wa.me/254700456049" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-card-btn"
                >
                  <span>Open WhatsApp</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="contact-card">
              <div className="contact-card-content">
                <div className="contact-card-icon contact-card-icon-phone">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-card-text">
                  <h3 className="contact-card-title">Call Us</h3>
                  <p className="contact-card-description">Speak directly with our team</p>
                </div>
                <a 
                  href="tel:0700456049" 
                  className="contact-card-btn contact-card-btn-phone"
                >
                  <span>Call Now</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form-wrapper">
            <div className="contact-form-card">
              <div className="contact-form-header">
                <div className="contact-form-icon">
                  <i className="fas fa-envelope-open-text"></i>
                </div>
                <h2 className="contact-form-title">Send us a Message</h2>
                <p className="contact-form-subtitle">Fill out the form below and we'll get back to you</p>
              </div>
              
              <form className="contact-form-form" onSubmit={handleSubmit}>
                <div className="contact-form-field">
                  <i className="fas fa-user contact-form-field-icon"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="contact-form-label">Your Name</label>
                  <span className="contact-form-underline"></span>
                </div>

                <div className="contact-form-field">
                  <i className="fas fa-envelope contact-form-field-icon"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                    placeholder=" "
                  />
                  <label htmlFor="email" className="contact-form-label">Email Address</label>
                  <span className="contact-form-underline"></span>
                </div>

                <div className="contact-form-field">
                  <i className="fas fa-phone contact-form-field-icon"></i>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="contact-form-input"
                    placeholder=" "
                  />
                  <label htmlFor="phone" className="contact-form-label">Phone Number</label>
                  <span className="contact-form-underline"></span>
                </div>

                <div className="contact-form-field">
                  <i className="fas fa-comment-dots contact-form-field-icon contact-form-field-icon-textarea"></i>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="contact-form-textarea"
                    placeholder=" "
                  ></textarea>
                  <label htmlFor="message" className="contact-form-label">Your Message</label>
                  <span className="contact-form-underline"></span>
                </div>

                <button type="submit" className="contact-form-submit">
                  <span>Send Message</span>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
