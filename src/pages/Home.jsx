import React, { useEffect } from 'react'
import Hero from '../components/Hero'
import Products from '../components/Products'

const Home = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0)
  }, [])

  return (
    <div>
      <Hero />
      <Products />
    </div>
  )
}

export default Home
