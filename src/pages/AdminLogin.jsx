import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductContext'
import './AdminLogin.css'

const AdminLogin = () => {
  const navigate = useNavigate()
  const { adminLogin } = useProducts()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const ok = adminLogin(username.trim(), password)
    if (!ok) {
      setError('Invalid credentials. Try admin / admin123.')
      return
    }
    navigate('/admin')
  }

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <p>Sign in to manage products.</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label htmlFor="adminUsername">Username</label>
          <input
            id="adminUsername"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="adminPassword">Password</label>
          <input
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit">Login</button>
        </form>

        <Link to="/" className="admin-login-back">
          Back to site
        </Link>
      </div>
    </section>
  )
}

export default AdminLogin
