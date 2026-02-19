import React from 'react'
import './WhatsAppFloat.css'

const WhatsAppFloat = () => {
  return (
    <a 
      href="https://wa.me/254700456049" 
      className="whatsapp-float" 
      target="_blank" 
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="whatsapp-tooltip">Chat with us!</span>
    </a>
  )
}

export default WhatsAppFloat
