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
      <div className="contact-hero-gradient" style={{
        background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(102, 126, 234, 0.3) 0%, transparent 50%)`
      }}></div>
      <div className="contact-hero-content">
        <div className="hero-badge-animated">
          <span className="badge-dot"></span>
          <span>Let's Connect</span>
        </div>
        <h1 className="contact-hero-title">
          <span className="title-word">Get</span>
          <span className="title-word">In</span>
          <span className="title-word highlight">Touch</span>
        </h1>
        <p className="contact-hero-subtitle">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          <span>Scroll to contact</span>
        </div>
      </div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </section>
  )
}

export default ContactHero
