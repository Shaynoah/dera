import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = ({ product, delay = 0 }) => {
  const { addToCart } = useCart()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
    // Show notification (you can add a toast notification here)
  }

  return (
    <div className="product-card" style={{ animationDelay: `${delay}s` }}>
      <div className="product-image-wrapper">
        {!imageLoaded && <div className="image-skeleton"></div>}
        <img 
          src={product.image} 
          alt={product.name} 
          className={`product-image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div className="product-overlay">
          <button className="quick-view-btn" onClick={() => handleAddToCart()}>
            <i className="fas fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">KSh {product.price.toLocaleString()}</div>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <span className="btn-text">Add to Cart</span>
          <i className="fas fa-shopping-cart btn-icon"></i>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
