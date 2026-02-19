import React, { useEffect } from 'react'
import ProductCard from './ProductCard'
import { products } from '../data/products'
import './Products.css'

const Products = () => {
  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const cards = document.querySelectorAll('.product-card')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="products" className="products-section">
      <div className="container">
        <h2 className="section-title">Our Collection</h2>
        <div className="products-grid">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products
