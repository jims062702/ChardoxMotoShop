"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/Checkout.css"

const Checkout = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
  })
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
          },
          {
            id: 2,
            name: "Brake Pads",
            price: 850,
            quantity: 1,
            image: "brake-pads.jpg",
          },
          {
            id: 3,
            name: "Air Filter",
            price: 450,
            quantity: 1,
            image: "air-filter.jpg",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.12 // 12% tax
  }

  const calculateShipping = () => {
    return calculateSubtotal() > 5000 ? 0 : 150 // Free shipping over ₱5000
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.postalCode ||
      !formData.phone
    ) {
      setError("Please fill in all required fields")
      setIsSubmitting(false)
      return
    }

    try {
      // This would be replaced with your actual API call
      // Simulating API call
      setTimeout(() => {
        console.log("Order placed:", { items: cartItems, customer: formData, total: calculateTotal() })
        navigate("/order-confirmation")
      }, 2000)
    } catch (error) {
      console.error("❌ Error placing order:", error)
      setError("Failed to place order. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="checkout-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">Checkout</h1>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/cart")} disabled={isSubmitting}>
                <i className="bi bi-arrow-left me-2"></i>
                Back to Cart
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
              <div className="card mb-4 skeleton-card">
                <div className="card-body">
                  <div className="skeleton-title mb-4"></div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="skeleton-text mb-2"></div>
                      <div className="skeleton-input"></div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="skeleton-text mb-2"></div>
                      <div className="skeleton-input"></div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <div className="skeleton-text mb-2"></div>
                      <div className="skeleton-input"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card skeleton-card">
                <div className="card-body">
                  <div className="skeleton-title mb-4"></div>
                  <div className="skeleton-text mt-3"></div>
                  <div className="skeleton-text mt-2"></div>
                  <div className="skeleton-text mt-2"></div>
                  <div className="skeleton-button mt-4"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-8">
              <form onSubmit={handleSubmit}>
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-4">Shipping Information</h5>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label htmlFor="fullName" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="address" className="form-label">
                          Address
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-5">
                        <label htmlFor="city" className="form-label">
                          City
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-3">
                        <label htmlFor="postalCode" className="form-label">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="postalCode"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-4">Payment Method</h5>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        <i className="bi bi-cash me-2"></i>
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="creditCard"
                        value="creditCard"
                        checked={formData.paymentMethod === "creditCard"}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <label className="form-check-label" htmlFor="creditCard">
                        <i className="bi bi-credit-card me-2"></i>
                        Credit Card
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="gcash"
                        value="gcash"
                        checked={formData.paymentMethod === "gcash"}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                      />
                      <label className="form-check-label" htmlFor="gcash">
                        <i className="bi bi-wallet2 me-2"></i>
                        GCash
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-grid d-md-none">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting || cartItems.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-lg-4">
              <div className="card checkout-summary">
                <div className="card-body">
                  <h5 className="card-title fw-bold mb-4">Order Summary</h5>

                  <div className="order-items mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                          <div className="badge bg-primary rounded-circle me-2">{item.quantity}</div>
                          <span>{item.name}</span>
                        </div>
                        <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <span>₱{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax (12%)</span>
                    <span>₱{calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        `₱${calculateShipping().toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold fs-5">₱{calculateTotal().toLocaleString()}</span>
                  </div>

                  <div className="d-none d-md-block">
                    <button
                      type="submit"
                      form="checkout-form"
                      className="btn btn-primary w-100"
                      disabled={isSubmitting || cartItems.length === 0}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Place Order
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Checkout

