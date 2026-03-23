import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const ProductContext = createContext(null)
const STORAGE_KEY = 'dera_products'
const AUTH_KEY = 'dera_admin_auth'
const DEFAULT_CATEGORY = 'Backless Deras'
const LEGACY_DRESS_NAME_REGEX = /^Dress\s*\d+$/i
const PRODUCTS_TABLE = 'products'

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
  id: Number(product.id),
  name: normalizeName(product.name),
  sold: Boolean(product.sold),
  category: normalizeCategory(product.category),
  image: typeof product.image === 'string' ? product.image : '',
  price: Number(product.price) || 0,
})

const hasSupabaseConfig = Boolean(supabase)

const toDbPayload = (productInput) => ({
  name: normalizeName(productInput.name),
  description: typeof productInput.description === 'string' ? productInput.description : '',
  image: typeof productInput.image === 'string' ? productInput.image : '',
  price: Number(productInput.price) || 0,
  sold: Boolean(productInput.sold),
  category: normalizeCategory(productInput.category),
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
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)

  const loadProducts = useCallback(async () => {
    try {
      if (!hasSupabaseConfig) {
        setProducts(readProducts())
        return
      }

      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        throw error
      }

      setProducts((data || []).map(sanitizeProduct).filter((product) => Boolean(product.image)))
    } catch (error) {
      console.error('Failed to load products:', error)
      setProducts(readProducts())
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    if (hasSupabaseConfig) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const updateProduct = async (id, updates) => {
    if (!hasSupabaseConfig) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => (product.id === id ? { ...product, ...updates } : product)),
      )
      return true
    }

    const payload = toDbPayload({ ...products.find((product) => product.id === id), ...updates })
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Failed to update product:', error)
      return false
    }

    const updated = sanitizeProduct(data)
    setProducts((prevProducts) =>
      prevProducts.map((product) => (product.id === id ? updated : product)),
    )
    return true
  }

  const addProduct = async (productInput) => {
    if (!hasSupabaseConfig) {
      const nextId = products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1
      const newProduct = {
        id: nextId,
        sold: false,
        ...productInput,
        category: normalizeCategory(productInput.category),
        price: Number(productInput.price) || 0,
      }
      setProducts((prevProducts) => [...prevProducts, sanitizeProduct(newProduct)])
      return true
    }

    const payload = toDbPayload({ ...productInput, sold: false })
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert(payload)
      .select('*')
      .single()

    if (error) {
      console.error('Failed to add product:', error)
      return false
    }

    setProducts((prevProducts) => [...prevProducts, sanitizeProduct(data)])
    return true
  }

  const deleteProduct = async (id) => {
    if (!hasSupabaseConfig) {
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
      return true
    }

    const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id)
    if (error) {
      console.error('Failed to delete product:', error)
      return false
    }

    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id))
    return true
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
      isLoadingProducts,
      refreshProducts: loadProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      adminLogin,
      adminLogout,
      isAdminAuthenticated,
    }),
    [products, isLoadingProducts, loadProducts],
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
