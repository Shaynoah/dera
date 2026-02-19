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
    <div className="new-contact-page">
      {/* Main Contact Section */}
      <section className="contact-main-section">
        <div className="contact-container-new">
          {/* Left Side - Contact Info */}
          <div className="contact-info-side">
            <div className="info-card card-1">
              <div className="card-glow-effect"></div>
              <div className="card-content-wrapper">
                <div className="info-icon-wrapper whatsapp-icon">
                  <i className="fab fa-whatsapp"></i>
                  <div className="icon-pulse-ring"></div>
                  <div className="icon-shine"></div>
                </div>
                <div className="card-text-content">
                  <h3>WhatsApp</h3>
                  <p>Chat with us instantly</p>
                </div>
                <a 
                  href="https://wa.me/254700456049" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link-btn"
                >
                  <span>Open WhatsApp</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>

            <div className="info-card card-2">
              <div className="card-glow-effect"></div>
              <div className="card-content-wrapper">
                <div className="info-icon-wrapper phone-icon">
                  <i className="fas fa-phone"></i>
                  <div className="icon-pulse-ring"></div>
                  <div className="icon-shine"></div>
                </div>
                <div className="card-text-content">
                  <h3>Call Us</h3>
                  <p>Speak directly with our team</p>
                </div>
                <a 
                  href="tel:0700456049" 
                  className="contact-link-btn"
                >
                  <span>Call Now</span>
                  <i className="fas fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-form-side">
            <div className="form-wrapper-new">
              <div className="form-bg-animation"></div>
              <div className="form-header-new">
                <div className="form-icon-wrapper">
                  <i className="fas fa-envelope-open-text"></i>
                </div>
                <h2>Send us a Message</h2>
                <p>Fill out the form below and we'll get back to you</p>
              </div>
              
              <form className="contact-form-new" onSubmit={handleSubmit}>
                <div className="form-group-new">
                  <div className="input-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input-new"
                    placeholder=" "
                  />
                  <label htmlFor="name" className="form-label-new">Your Name</label>
                  <div className="input-underline"></div>
                </div>

                <div className="form-group-new">
                  <div className="input-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-new"
                    placeholder=" "
                  />
                  <label htmlFor="email" className="form-label-new">Email Address</label>
                  <div className="input-underline"></div>
                </div>

                <div className="form-group-new">
                  <div className="input-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input-new"
                    placeholder=" "
                  />
                  <label htmlFor="phone" className="form-label-new">Phone Number</label>
                  <div className="input-underline"></div>
                </div>

                <div className="form-group-new">
                  <div className="input-icon textarea-icon">
                    <i className="fas fa-comment-dots"></i>
                  </div>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-textarea-new"
                    placeholder=" "
                  ></textarea>
                  <label htmlFor="message" className="form-label-new">Your Message</label>
                  <div className="input-underline"></div>
                </div>

                <button type="submit" className="submit-btn-new">
                  <span className="btn-text">Send Message</span>
                  <i className="fas fa-paper-plane"></i>
                  <div className="btn-shine"></div>
                  <div className="btn-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
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
