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
              entry.target.classList.add('opacity-100', 'translate-y-0')
              observer.unobserve(entry.target)
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
        className="quick-card"
        target="_blank" 
        rel="noopener noreferrer"
        ref={(el) => (cardsRef.current[0] = el)}
        key="whatsapp"
      >
        <div className="quick-card-icon quick-card-icon-whatsapp">
          <i className="fab fa-whatsapp"></i>
        </div>
        <div className="quick-card-content">
          <h3 className="quick-card-title">WhatsApp</h3>
          <p className="quick-card-description">Chat instantly</p>
        </div>
        <div className="quick-card-arrow">
          <i className="fas fa-arrow-right"></i>
        </div>
        <div className="quick-card-shine"></div>
      </a>
      <a 
        href="tel:0700456049" 
        className="quick-card"
        ref={(el) => (cardsRef.current[1] = el)}
        key="phone"
      >
        <div className="quick-card-icon quick-card-icon-phone">
          <i className="fas fa-phone"></i>
        </div>
        <div className="quick-card-content">
          <h3 className="quick-card-title">Call Us</h3>
          <p className="quick-card-description">0700456049</p>
        </div>
        <div className="quick-card-arrow">
          <i className="fas fa-arrow-right"></i>
        </div>
        <div className="quick-card-shine"></div>
      </a>
    </div>
  )
}

export default QuickContactCards
