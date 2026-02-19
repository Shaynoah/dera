import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-background" style={{ backgroundImage: 'url(/image1.jpg)' }}></div>
      <div className="hero-particles"></div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-text">New Collection 2026</span>
        </div>
        <h1 className="hero-title">
          <span className="title-main">Dera Drip</span>
        </h1>
        <p className="hero-subtitle">Premium Clothing for the Modern You</p>
        <div className="hero-about">
          <p className="about-text">
            Dera Drip is your destination for premium, stylish clothing that reflects your unique personality. 
            We offer a curated collection of high-quality garments designed to make you stand out.
          </p>
        </div>
        <div className="hero-features">
          <div className="feature-item">
            <i className="fas fa-shipping-fast"></i>
            <span>Fast Delivery</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-shield-alt"></i>
            <span>Quality Guaranteed</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-heart"></i>
            <span>100% Satisfaction</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-tags"></i>
            <span>Best Prices</span>
          </div>
        </div>
        <div className="hero-welcome-message">
          <p className="welcome-text">
            <i className="fas fa-star"></i>
            Join thousands of satisfied customers who trust Dera Drip for their fashion needs
            <i className="fas fa-star"></i>
          </p>
        </div>
        <div className="hero-actions">
          <a href="#products" className="btn btn-primary">
            <span>Shop Now</span>
            <i className="fas fa-arrow-right"></i>
          </a>
          <Link to="/contact" className="btn btn-secondary">
            <span>Contact Us</span>
            <i className="fas fa-phone"></i>
          </Link>
        </div>
      </div>
      <div className="hero-overlay"></div>
    </section>
  )
}

export default Hero
