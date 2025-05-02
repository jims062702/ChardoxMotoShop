"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronDown, ChevronUp, Package } from "lucide-react"
import "../styles/MyOrders.css"

const MyOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with your actual API call
      // Simulating API call with mock data
      setTimeout(() => {
        const mockOrders = [
          {
            id: "ORD-2023-001",
            date: "2023-05-15",
            status: "Delivered",
            total: 3250,
            items: [
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
            ],
            shippingAddress: "123 Main St, Anytown, Philippines",
            paymentMethod: "Cash on Delivery",
          },
          {
            id: "ORD-2023-002",
            date: "2023-06-02",
            status: "Processing",
            total: 4500,
            items: [
              {
                id: 3,
                name: "Air Filter",
                price: 450,
                quantity: 1,
                image: "air-filter.jpg",
              },
              {
                id: 4,
                name: "Chain Lubricant",
                price: 350,
                quantity: 1,
                image: "chain-lubricant.jpg",
              },
              {
                id: 5,
                name: "Motorcycle Battery",
                price: 3700,
                quantity: 1,
                image: "battery.jpg",
              },
            ],
            shippingAddress: "456 Oak Ave, Somewhere City, Philippines",
            paymentMethod: "GCash",
          },
        ]
        setOrders(mockOrders)
        setIsLoading(false)
      }, 1500)
    } catch (error) {
      console.error("❌ Error fetching orders:", error)
      setError("Failed to load orders. Please try again.")
      setIsLoading(false)
    }
  }

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "badge bg-success"
      case "processing":
        return "badge bg-primary"
      case "shipped":
        return "badge bg-info"
      case "cancelled":
        return "badge bg-danger"
      default:
        return "badge bg-secondary"
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="my-orders-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">My Orders</h1>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/client-dashboard")}>
                <ArrowLeft size={16} className="me-2" />
                Back to Dashboard
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
          <div className="orders-skeleton">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card mb-3 skeleton-card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text sm"></div>
                    </div>
                    <div className="col-md-3">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text sm"></div>
                    </div>
                    <div className="col-md-3">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text sm"></div>
                    </div>
                    <div className="col-md-3">
                      <div className="skeleton-text"></div>
                      <div className="skeleton-button"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <Package size={64} className="text-muted mb-3" />
            <h3>No orders yet</h3>
            <p className="text-muted mb-4">You haven't placed any orders yet</p>
            <button className="btn btn-primary" onClick={() => navigate("/client-dashboard")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="card mb-4 order-card">
                <div className="card-header">
                  <div className="row align-items-center">
                    <div className="col-md-3 col-6">
                      <div className="order-label">Order ID</div>
                      <div className="order-value">{order.id}</div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="order-label">Date</div>
                      <div className="order-value">{formatDate(order.date)}</div>
                    </div>
                    <div className="col-md-3 col-6 mt-3 mt-md-0">
                      <div className="order-label">Status</div>
                      <div className="order-value">
                        <span className={getStatusBadgeClass(order.status)}>{order.status}</span>
                      </div>
                    </div>
                    <div className="col-md-3 col-6 mt-3 mt-md-0">
                      <div className="order-label">Total</div>
                      <div className="order-value fw-bold">₱{order.total.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="card-body">
                  <button
                    className="btn btn-outline-primary w-100 d-flex justify-content-between align-items-center"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <span>
                      {expandedOrder === order.id ? "Hide Details" : "View Details"} ({order.items.length} items)
                    </span>
                    {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {expandedOrder === order.id && (
                    <div className="order-details mt-4">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="mb-3">Shipping Address</h6>
                          <p>{order.shippingAddress}</p>

                          <h6 className="mb-3 mt-4">Payment Method</h6>
                          <p>{order.paymentMethod}</p>
                        </div>
                        <div className="col-md-6">
                          <h6 className="mb-3">Order Items</h6>
                          {order.items.map((item) => (
                            <div key={item.id} className="order-item">
                              <div className="order-item-image">
                                <img
                                  src={`http://localhost:5010/uploads/${item.image}`}
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.onerror = null
                                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                                  }}
                                />
                              </div>
                              <div className="order-item-details">
                                <div className="order-item-name">{item.name}</div>
                                <div className="order-item-price">
                                  ₱{item.price.toLocaleString()} x {item.quantity}
                                </div>
                              </div>
                              <div className="order-item-total">₱{(item.price * item.quantity).toLocaleString()}</div>
                            </div>
                          ))}

                          <div className="order-summary mt-4">
                            <div className="d-flex justify-content-between">
                              <span>Subtotal</span>
                              <span>₱{order.total.toLocaleString()}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Shipping</span>
                              <span>Free</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold mt-2">
                              <span>Total</span>
                              <span>₱{order.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.status === "Delivered" && (
                        <div className="mt-4">
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-star me-2"></i>
                            Write a Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyOrders

