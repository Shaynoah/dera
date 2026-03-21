import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useCart } from '../context/CartContext'
import './ProductCard.css'

const ProductCard = ({
  product,
  delay = 0,
  activePreviewId = null,
  onOpenPreview = () => {},
  onClosePreview = () => {},
}) => {
  const { addToCart } = useCart()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const isSold = Boolean(product.sold)
  const hasImage = Boolean(product.image)
  const isPreviewOpen = activePreviewId === product.id

  const handleAddToCart = () => {
    if (isSold) return
    for (let index = 0; index < quantity; index += 1) {
      addToCart(product)
    }
  }

  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))
  }

  const openPreview = () => {
    if (!hasImage) return
    onOpenPreview(product.id)
  }

  const closePreview = () => {
    onClosePreview()
  }

  useEffect(() => {
    if (!isPreviewOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClosePreview()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isPreviewOpen, onClosePreview])

  return (
    <div className={`product-card ${isSold ? 'sold' : ''}`} style={{ animationDelay: `${delay}s` }}>
      <div
        className="product-card-image-wrapper"
        onClick={openPreview}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openPreview()
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Open product image"
      >
        {hasImage && !imageLoaded && <div className="product-card-loading"></div>}
        {hasImage ? (
          <img
            src={product.image}
            alt={product.name || product.category || 'Dera'}
            className="product-card-image"
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        ) : (
          <div className="product-card-no-image">Image coming soon</div>
        )}
      </div>
      <div className="product-card-content">
        {product.name && <h3 className="product-card-title">{product.name}</h3>}
        {product.description && <p className="product-card-description">{product.description}</p>}
        <div className="product-card-price">{product.price.toLocaleString()} KES</div>

        <div className="product-card-actions">
          <div className="product-card-qty">
            <button type="button" onClick={decreaseQuantity} disabled={isSold}>
              -
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={increaseQuantity} disabled={isSold}>
              +
            </button>
          </div>
          <button className="product-card-btn" onClick={handleAddToCart} disabled={isSold}>
            {isSold ? 'Sold Out' : 'Add to cart'}
          </button>
        </div>
      </div>

      {isPreviewOpen &&
        createPortal(
          <div className="product-lightbox" onClick={closePreview}>
            <button
              type="button"
              className="product-lightbox-close"
              onClick={closePreview}
              aria-label="Close image preview"
            >
              x
            </button>
            <img
              src={product.image}
              alt={product.name || product.category || 'Dera'}
              className="product-lightbox-image"
              onClick={(event) => event.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}

export default ProductCard
