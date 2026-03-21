import React, { useEffect, useState } from 'react'
import './ContactHero.css'

const ContactHero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="contact-hero">
      <div className="contact-hero-background"></div>
      <div className="contact-hero-particles"></div>
      <div 
        className="contact-hero-mouse-effect" 
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)`
        }}
      ></div>
      <div className="contact-hero-content">
        <div className="contact-hero-badge">
          <span className="contact-hero-badge-dot"></span>
          <span>Let's Connect</span>
        </div>
        <h1 className="contact-hero-title">
          <span className="contact-hero-title-word">Get</span>
          <span className="contact-hero-title-word">In</span>
          <span className="contact-hero-title-word-touch">Touch</span>
        </h1>
        <p className="contact-hero-description">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <div className="contact-hero-scroll">
          <div className="contact-hero-scroll-line"></div>
          <span className="contact-hero-scroll-text">Scroll to contact</span>
        </div>
      </div>
      <div className="contact-hero-shapes">
        <div className="contact-hero-shape"></div>
        <div className="contact-hero-shape"></div>
        <div className="contact-hero-shape"></div>
      </div>
    </section>
  )
}

export default ContactHero
