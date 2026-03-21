import React from 'react'
import { Navigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'

const ProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated } = useProducts()

  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
