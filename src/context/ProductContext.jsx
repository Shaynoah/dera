import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ProductContext = createContext(null)
const STORAGE_KEY = 'dera_products'
const AUTH_KEY = 'dera_admin_auth'
const DEFAULT_CATEGORY = 'Backless Deras'
const LEGACY_DRESS_NAME_REGEX = /^Dress\s*\d+$/i

const normalizeCategory = (category) =>
  category === 'Full Deras' || category === 'Backless Deras' ? category : DEFAULT_CATEGORY

const normalizeName = (name) => {
  if (typeof name !== 'string') return ''
  const trimmedName = name.trim()
  if (!trimmedName || LEGACY_DRESS_NAME_REGEX.test(trimmedName)) return ''
  return trimmedName
}

const sanitizeProduct = (product) => ({
  ...product,
  name: normalizeName(product.name),
  sold: Boolean(product.sold),
  category: normalizeCategory(product.category),
  // Keep only uploaded images (data URLs). Drop older external URLs.
  image: typeof product.image === 'string' && product.image.startsWith('data:image/') ? product.image : '',
})

const readProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(sanitizeProduct).filter((product) => Boolean(product.image))
  } catch {
    return []
  }
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(readProducts)

  useEffect(() => {
    // Cleanup any legacy products that do not have uploaded images.
    setProducts((prevProducts) =>
      prevProducts.filter(
        (product) =>
          typeof product.image === 'string' &&
          product.image.startsWith('data:image/') &&
          product.image.trim().length > 0,
      ),
    )
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const updateProduct = (id, updates) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? { ...product, ...updates } : product)),
    )
  }

  const addProduct = (productInput) => {
    const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1
    const newProduct = {
      id: nextId,
      sold: false,
      ...productInput,
      category: normalizeCategory(productInput.category),
      price: Number(productInput.price) || 0,
    }
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  const deleteProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
  }

  const adminLogin = (username, password) => {
    // Basic credential gate for a frontend-only admin panel.
    const isValid = username === 'admin' && password === 'admin123'
    if (isValid) {
      localStorage.setItem(AUTH_KEY, 'true')
    }
    return isValid
  }

  const adminLogout = () => {
    localStorage.removeItem(AUTH_KEY)
  }

  const isAdminAuthenticated = () => localStorage.getItem(AUTH_KEY) === 'true'

  const value = useMemo(
    () => ({
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      adminLogin,
      adminLogout,
      isAdminAuthenticated,
    }),
    [products],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}
