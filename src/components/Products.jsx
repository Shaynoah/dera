import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { useProducts } from '../context/ProductContext'
import './Products.css'

const Products = () => {
  const { products } = useProducts()
  const [activePreviewId, setActivePreviewId] = useState(null)
  const backlessDeras = products.filter((product) => product.category !== 'Full Deras')
  const fullDeras = products.filter((product) => product.category === 'Full Deras')

  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    const cards = document.querySelectorAll('.product-card')
    cards.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [products])

  return (
    <section id="products" className="products">
      <div className="container">
        <h2 className="products-title">Our Collection</h2>

        {backlessDeras.length > 0 && (
          <div className="products-category">
            <h3 className="products-category-title">Backless Deras</h3>
            <div className="products-grid">
              {backlessDeras.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={index * 0.1}
                  activePreviewId={activePreviewId}
                  onOpenPreview={setActivePreviewId}
                  onClosePreview={() => setActivePreviewId(null)}
                />
              ))}
            </div>
          </div>
        )}

        {fullDeras.length > 0 && (
          <div className="products-category">
            <h3 className="products-category-title">Full Deras</h3>
            <div className="products-grid">
              {fullDeras.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  delay={index * 0.1}
                  activePreviewId={activePreviewId}
                  onOpenPreview={setActivePreviewId}
                  onClosePreview={() => setActivePreviewId(null)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Products
