import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { cartItems } = useCart()
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCartClick = () => {
    const cartSidebar = document.querySelector('.cart-sidebar')
    const cartOverlay = document.querySelector('.cart-overlay')
    if (cartSidebar) cartSidebar.classList.add('active')
    if (cartOverlay) cartOverlay.classList.add('active')
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-brand">
          <Link to="/">
            <div className="nav-brand-content">
              <img src="/logo.png" alt="Dera Drip" className="nav-logo" />
              <h1>Dera Drip</h1>
            </div>
            <p className="nav-slogan">Premium Clothing for the Modern You</p>
          </Link>
        </div>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><a href="/#products" onClick={() => setMenuOpen(false)}>Products</a></li>
          <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
        </ul>
        <div className="nav-actions">
          <button className="cart-btn" id="cartBtn" onClick={handleCartClick}>
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </button>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
