import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import './AdminDashboard.css'

const emptyProduct = { image: '', price: '', category: 'Backless Deras' }

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { products, updateProduct, addProduct, deleteProduct, adminLogout } = useProducts()
  const [draft, setDraft] = useState(emptyProduct)
  const [priceDrafts, setPriceDrafts] = useState({})
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  const handleAddProduct = (event) => {
    event.preventDefault()
    if (!draft.image.trim()) {
      setUploadError('Please upload a product image file.')
      return
    }
    const numericPrice = Number.parseFloat(draft.price)
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setUploadError('Please enter a valid price.')
      return
    }
    addProduct({
      name: '',
      description: '',
      image: draft.image.trim(),
      price: numericPrice,
      category: draft.category,
    })
    setDraft(emptyProduct)
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setDraft((prev) => ({ ...prev, image: String(reader.result || '') }))
      setUploadError('')
    }
    reader.onerror = () => {
      setUploadError('Could not read the selected image. Please try another file.')
    }
    reader.readAsDataURL(file)
  }

  const handleExistingImageUpload = (productId, event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      updateProduct(productId, { image: String(reader.result || '') })
      setUploadError('')
    }
    reader.onerror = () => {
      setUploadError('Could not read the selected image. Please try another file.')
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteProduct = (productId) => {
    deleteProduct(productId)
  }

  const handleToggleSold = (product) => {
    updateProduct(product.id, { sold: !product.sold })
  }

  const handlePriceDraftChange = (productId, value) => {
    setPriceDrafts((prev) => ({ ...prev, [productId]: value }))
  }

  const handleCategoryChange = (productId, category) => {
    updateProduct(productId, { category })
  }

  const handleUpdatePrice = (product) => {
    const value = priceDrafts[product.id]
    const numericPrice = Number.parseFloat(value)
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setUploadError('Please enter a valid price before updating.')
      return
    }
    updateProduct(product.id, { price: numericPrice })
    setUploadError('')
  }

  return (
    <section className="admin-dashboard">
      <div className="container">
        <div className="admin-dashboard-header">
          <div className="admin-header-copy">
            <span className="admin-badge">Dera Studio</span>
            <h1>Product Admin</h1>
            <p>Manage your latest pieces, pricing, and sold status.</p>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <form className="admin-add-form" onSubmit={handleAddProduct}>
          <h2>Add Product</h2>
          <select
            value={draft.category}
            onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
          >
            <option value="Backless Deras">Backless Deras</option>
            <option value="Full Deras">Full Deras</option>
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={draft.price}
            onChange={(event) => setDraft((prev) => ({ ...prev, price: event.target.value }))}
            required
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            required
          />
          {uploadError && <p className="admin-upload-error">{uploadError}</p>}
          <button type="submit">Add Product</button>
        </form>

        <div className="admin-products-list">
          {products.map((product) => (
            <article className="admin-product-item" key={product.id}>
              {product.image ? (
                <img src={product.image} alt={product.category || 'Dera'} />
              ) : (
                <div className="admin-product-no-image">No image uploaded</div>
              )}
              <div className="admin-product-details">
                <div className="admin-category-editor">
                  <label>
                    Category
                    <select
                      value={product.category || 'Backless Deras'}
                      onChange={(event) => handleCategoryChange(product.id, event.target.value)}
                    >
                      <option value="Backless Deras">Backless Deras</option>
                      <option value="Full Deras">Full Deras</option>
                    </select>
                  </label>
                </div>
                <div className="admin-price-editor">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={`Price (${Number(product.price || 0).toFixed(2)})`}
                    value={priceDrafts[product.id] ?? ''}
                    onChange={(event) => handlePriceDraftChange(product.id, event.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-price-btn"
                    onClick={() => handleUpdatePrice(product)}
                  >
                    Update Price
                  </button>
                </div>
                <label>
                  Replace Product Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleExistingImageUpload(product.id, event)}
                  />
                </label>
                <button
                  type="button"
                  className={`admin-sold-btn ${product.sold ? 'is-sold' : ''}`}
                  onClick={() => handleToggleSold(product)}
                >
                  {product.sold ? 'Marked as Sold' : 'Mark as Sold'}
                </button>
                <button
                  type="button"
                  className="admin-delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete Product
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
