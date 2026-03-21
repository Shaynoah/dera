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
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-content">
            <img src="/logo.png" alt="Dera Drip" className="navbar-logo" />
            <div>
            <h1 className="navbar-title">Dera Drip</h1>
          <p className="navbar-tagline">Premium Clothing for the Modern You</p>
            </div>
          </div>
        </Link>

        <ul className={`navbar-nav ${menuOpen ? 'menu-open' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          </li>
          <li>
            <a href="/#products" onClick={() => setMenuOpen(false)}>Products</a>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </li>
          <li>
            <Link to="/admin/login" onClick={() => setMenuOpen(false)}>Admin</Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <button className="cart-btn" id="cartBtn" onClick={handleCartClick} aria-label="Shopping Cart">
            <i className="fas fa-shopping-cart"></i>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
