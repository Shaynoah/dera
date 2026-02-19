import React, { useEffect, useRef } from 'react'
import './QuickContactCards.css'

const QuickContactCards = () => {
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in')
            }, index * 150)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="quick-contact-cards">
      <a 
        href="https://wa.me/254700456049" 
        className="quick-card whatsapp-card" 
        target="_blank" 
        rel="noopener noreferrer"
        ref={(el) => (cardsRef.current[0] = el)}
        key="whatsapp"
      >
        <div className="card-glow"></div>
        <div className="quick-card-icon">
          <i className="fab fa-whatsapp"></i>
          <div className="icon-pulse"></div>
        </div>
        <div className="quick-card-content">
          <h3>WhatsApp</h3>
          <p>Chat instantly</p>
        </div>
        <div className="quick-card-arrow-wrapper">
          <i className="fas fa-arrow-right quick-card-arrow"></i>
        </div>
        <div className="card-hover-effect"></div>
      </a>
      <a 
        href="tel:0700456049" 
        className="quick-card phone-card"
        ref={(el) => (cardsRef.current[1] = el)}
        key="phone"
      >
        <div className="card-glow"></div>
        <div className="quick-card-icon">
          <i className="fas fa-phone"></i>
          <div className="icon-pulse"></div>
        </div>
        <div className="quick-card-content">
          <h3>Call Us</h3>
          <p>0700456049</p>
        </div>
        <div className="quick-card-arrow-wrapper">
          <i className="fas fa-arrow-right quick-card-arrow"></i>
        </div>
        <div className="card-hover-effect"></div>
      </a>
    </div>
  )
}

export default QuickContactCards
