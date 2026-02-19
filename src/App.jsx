import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Contact from './pages/Contact'
import CartSidebar from './components/CartSidebar'
import WhatsAppFloat from './components/WhatsAppFloat'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <CartSidebar />
          <WhatsAppFloat />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  )
}

export default App
