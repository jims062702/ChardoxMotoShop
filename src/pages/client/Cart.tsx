"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/Cart.css"

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with your actual API call
      // Simulating API call with mock data
      setTimeout(() => {
        const mockCartItems = [
          {
            id: 1,
            name: "Motorcycle Engine Oil",
            price: 1200,
            quantity: 2,
            image: "engine-oil.jpg",
            stock: 10,
          },
          {
            id: 2,
            name: "Brake Pads",
            price: 850,
            quantity: 1,
            image: "brake-pads.jpg",
            stock: 15,
          },
          {
            id: 3,
            name: "Air Filter",
            price: 450,
            quantity: 1,
            image: "air-filter.jpg",
            stock: 8,
          },
        ]
        setCartItems(mockCartItems)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error fetching cart items:", error)
      setError("Failed to load cart items. Please try again.")
      setIsLoading(false)
    }
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map((item) => {
      if (item.id === itemId) {
        // Don't exceed available stock
        const quantity = Math.min(newQuantity, item.stock)
        return { ...item, quantity }
      }
      return item
    })

    setCartItems(updatedItems)
  }

  const removeItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId)
    setCartItems(updatedItems)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.12 // 12% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleCheckout = () => {
    navigate("/checkout")
  }

  return (
    <div className="cart-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">Shopping Cart</h1>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/client-dashboard")}>
                <i className="bi bi-arrow-left me-2"></i>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="row">
            <div className="col-lg-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card mb-3 skeleton-card">
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-2">
                        <div className="skeleton-img-sm"></div>
                      </div>
                      <div className="col-md-5">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-text mt-2"></div>
                      </div>
                      <div className="col-md-2">
                        <div className="skeleton-price"></div>
                      </div>
                      <div className="col-md-3">
                        <div className="skeleton-quantity"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="card skeleton-card">
                <div className="card-body">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text mt-3"></div>
                  <div className="skeleton-text mt-2"></div>
                  <div className="skeleton-text mt-2"></div>
                  <div className="skeleton-button mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-cart-x display-1 text-muted"></i>
            <h3 className="mt-3">Your cart is empty</h3>
            <p className="text-muted mb-4">Looks like you haven't added any items to your cart yet.</p>
            <button className="btn btn-primary" onClick={() => navigate("/client-dashboard")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              {cartItems.map((item) => (
                <div key={item.id} className="card mb-3 cart-item">
                  <div className="card-body">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-2 col-4">
                        <img
                          src={`http://localhost:5010/uploads/${item.image}`}
                          alt={item.name}
                          className="img-fluid rounded"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                      </div>
                      <div className="col-md-4 col-8">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="text-muted small mb-0">
                          <span className="badge bg-light text-dark border">Stock: {item.stock}</span>
                        </p>
                      </div>
                      <div className="col-md-2 col-4">
                        <p className="fw-bold mb-0">₱{item.price.toLocaleString()}</p>
                      </div>
                      <div className="col-md-2 col-4">
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            className="form-control text-center"
                            value={item.quantity}
                            min="1"
                            max={item.stock}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2 col-4 text-end">
                        <button className="btn btn-outline-danger" onClick={() => removeItem(item.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-lg-4">
              <div className="card cart-summary">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-4">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>₱{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (12%)</span>
                    <span>₱{calculateTax().toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">₱{calculateTotal().toLocaleString()}</span>
                  </div>
                  <button className="btn btn-primary w-100" onClick={handleCheckout} disabled={cartItems.length === 0}>
                    <i className="bi bi-credit-card me-2"></i>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart

