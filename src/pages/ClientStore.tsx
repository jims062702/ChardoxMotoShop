"use client"

import { useState, useEffect } from "react"
import { Button, Container, Row, Col, Modal, Form, Alert } from "react-bootstrap"
import { FaShoppingCart, FaDownload, FaRedo, FaCreditCard, FaDollarSign } from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/ClientStore.css"

interface Product {
  id: number
  name: string
  price: number
  description: string
  stock: number
  image: string
  category: string
}

interface CartItem extends Product {
  quantity: number
}

interface CustomerInfo {
  name: string
  email: string
  phone: string
}

const ClientStore = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "e-wallet">("cash")
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
  })
  const [alert, setAlert] = useState<{ type: string; message: string } | null>(null)
  const [orderDate, setOrderDate] = useState<Date>(new Date())
  const [currentSlide, setCurrentSlide] = useState(0)
  const [animationDirection, setAnimationDirection] = useState<"right" | "left" | "zoom" | "fade">("fade")
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: "" })

  // Slider images - replace with your actual image paths
  const sliderImages = [
    "/images/4.webp",
    "/images/car-engine-motor-oil-3d-lubricant-splash-bottle-vector.jpg",
    "images/realistic-car-engine-motor-oil-bottle-with-splash-vector.jpg",
  ]

  // Fetch products from the API
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Update the slider animation logic in the component

  // Replace the existing slider image fade effect with the new animation system
  useEffect(() => {
    const sliderImg = document.querySelector(".slider-img") as HTMLElement
    if (sliderImg) {
      // First set opacity to 0 to prepare for animation
      sliderImg.style.opacity = "0"

      // Remove all animation classes
      sliderImg.classList.remove("animate", "animate-right", "animate-left", "animate-zoom")

      // Short delay to ensure opacity change is applied before animation starts
      setTimeout(() => {
        // Force a reflow
        void sliderImg.offsetWidth

        // Reset opacity to let the animation handle it
        sliderImg.style.opacity = ""

        // Add the appropriate animation class
        if (animationDirection === "right") {
          sliderImg.classList.add("animate-right")
        } else if (animationDirection === "left") {
          sliderImg.classList.add("animate-left")
        } else if (animationDirection === "zoom") {
          sliderImg.classList.add("animate-zoom")
        } else {
          sliderImg.classList.add("animate")
        }
      }, 50)
    }
  }, [currentSlide, animationDirection])

  // Auto-advance slider with a more subtle animation
  useEffect(() => {
    const interval = setInterval(() => {
      // Use fade animation for auto-advance for a more subtle effect
      setAnimationDirection("fade")
      setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [sliderImages.length])

  // Auto-hide notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "" })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/parts/get-parts")
      if (!response.ok) throw new Error("Failed to fetch products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      setAlert({ type: "danger", message: "Failed to load products. Please try again later." })
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/parts/get-categories")
      if (!response.ok) throw new Error("Failed to fetch categories")
      const data = await response.json()
      const categoryList = data.map((cat: { category: string }) => cat.category)
      setCategories(categoryList)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Filter products based on search query and selected category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Add product to cart
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stock) {
          setAlert({
            type: "warning",
            message: `Sorry, only ${product.stock} items available in stock.`,
          })
          return prevCart
        }

        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })

    // Show notification
    setNotification({
      show: true,
      message: `${product.name} added to cart!`,
    })
  }

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Update item quantity in cart
  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      newQuantity = 1
    }

    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.stock) {
      setAlert({
        type: "warning",
        message: `Sorry, only ${product.stock} items available in stock.`,
      })
      newQuantity = product.stock
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  // Calculate total price
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Add a function to check if any cart item has reached its stock limit
  const getStockWarnings = () => {
    const warnings = []

    for (const item of cart) {
      const product = products.find((p) => p.id === item.id)
      if (product && item.quantity >= product.stock) {
        warnings.push({
          id: item.id,
          name: item.name,
          stock: product.stock,
        })
      }
    }

    return warnings
  }

  // Get stock background color based on stock level
  const getStockBackgroundColor = (stock: number) => {
    if (stock === 0) return "bg-danger text-white"
    if (stock < 10) return "bg-warning text-dark"
    return "bg-success text-white"
  }

  // Handle checkout process
  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      setAlert({ type: "danger", message: "Please provide your name and phone number" })
      return
    }

    try {
      // Record the sale in the database
      const saleData = {
        customer: customerInfo.name,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: calculateTotal(),
        paymentMethod: paymentMethod,
        date: new Date().toISOString(),
      }
      console.log("Sale request sent:", saleData)

      // Send the data to the backend
      try {
        const response = await fetch("http://localhost:5010/api/sales/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        })

        if (!response.ok) throw new Error("Failed to process order")

        console.log("Order processed successfully!")

        // Update stock levels for each purchased item
        for (const item of cart) {
          try {
            const stockUpdateResponse = await fetch(`http://localhost:5010/api/parts/update-stock/${item.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: item.quantity,
                operation: "decrease",
              }),
            })

            if (!stockUpdateResponse.ok) {
              console.error(`Failed to update stock for item ${item.id}`)
            } else {
              console.log(`Stock updated for item ${item.id}, reduced by ${item.quantity}`)
            }
          } catch (error) {
            console.error(`Error updating stock for item ${item.id}:`, error)
          }
        }
      } catch (error) {
        console.error("Error saving order to database:", error)
        // Continue with receipt even if saving fails
        console.log("Continuing with receipt generation despite database error")
      }

      // Set the order date for the receipt
      setOrderDate(new Date())

      // Close checkout modal and show receipt
      setShowCheckout(false)
      setShowReceipt(true)
    } catch (error) {
      console.error("Error processing order:", error)
      setAlert({ type: "danger", message: "Failed to process your order. Please try again." })
    }
  }

  // Generate and download receipt
  const downloadReceipt = () => {
    const receiptContent = document.getElementById("receipt-content")
    if (!receiptContent) return

    const receiptHtml = receiptContent.innerHTML

    // Create a Blob with the HTML content
    const blob = new Blob(
      [
        `
      <html>
        <head>
          <title>Purchase Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .contact { margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .total-row { font-weight: bold; }
            .footer { margin-top: 30px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="company-name">CHARDOX MOTO PARTS & SERVICES</div>
              <div class="contact">Contact: +639309655074</div>
              <div class="date">Date: ${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</div>
            </div>
            
            <h3>Receipt</h3>
            <p>Customer: ${customerInfo.name}</p>
            <p>Phone: ${customerInfo.phone}</p>
            
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${cart
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>₱${item.price.toLocaleString()}</td>
                    <td>${item.quantity}</td>
                    <td>₱${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `,
                  )
                  .join("")}
                <tr class="total-row">
                  <td colspan="3">Total</td>
                  <td>₱${calculateTotal().toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            
            <p>Payment Method: ${paymentMethod === "cash" ? "Cash" : "E-Wallet"}</p>
            
            <div class="footer">
              Thank you for your purchase!
            </div>
          </div>
        </body>
      </html>
    `,
      ],
      { type: "text/html" },
    )

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob)

    // Create a link element
    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${Date.now()}.html`

    // Append to the document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Release the URL object
    URL.revokeObjectURL(url)
  }

  // Reset the entire transaction
  const resetTransaction = () => {
    setCart([])
    setCustomerInfo({
      name: "",
      email: "",
      phone: "",
    })
    setPaymentMethod("cash")
    setShowCart(false)
    setShowCheckout(false)
    setShowReceipt(false)
    setAlert({ type: "info", message: "Started a new transaction" })

    // Clear alert after 3 seconds
    setTimeout(() => {
      setAlert(null)
    }, 3000)
  }

  return (
    <div className="client-store">
      {/* Header */}
      <header className="store-header">
        <Container>
          <Row className="align-items-center">
            <Col xs={6} md={4} className="d-flex align-items-center">
              <h1 className="mb-0">CHARDOX MOTO PARTS & SERVICES</h1>
            </Col>

            <Col xs={12} md={5} className="my-2 my-md-0">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
              </div>
            </Col>

            <Col xs={6} md={3} className="d-flex justify-content-end">
              <Button variant="outline-light" className="cart-button" onClick={() => setShowCart(true)}>
                <FaShoppingCart size={20} />
                <span className="ms-2">Cart ({cart.length})</span>
              </Button>
            </Col>
          </Row>
        </Container>
      </header>

      {/* Image Slider */}
      <div className="slider-container">
        <div className="slider-image">
          <img
            src={sliderImages[currentSlide] || "/placeholder.svg"}
            alt="Promotional banner"
            className="slider-img"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=500&width=1200"
            }}
          />
        </div>
        <div className="slider-dots">
          {sliderImages.map((_, index) => (
            <span
              key={index}
              className={`slider-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => {
                setAnimationDirection("zoom")
                setCurrentSlide(index)
              }}
            ></span>
          ))}
        </div>
        <div
          className="slider-arrow prev"
          onClick={() => {
            setAnimationDirection("left")
            setCurrentSlide((prev) => (prev === 0 ? sliderImages.length - 1 : prev - 1))
          }}
        >
          &#10094;
        </div>
        <div
          className="slider-arrow next"
          onClick={() => {
            setAnimationDirection("right")
            setCurrentSlide((prev) => (prev === sliderImages.length - 1 ? 0 : prev + 1))
          }}
        >
          &#10095;
        </div>
      </div>

      <Container className="mt-4">
        {/* Alert Messages */}

        <Row>
          {/* Categories Sidebar */}
          <Col md={3}>
            <div className="categories-sidebar">
              <h5 className="categories-title">
                <span className="category-icon">
                  <i className="fa fa-tags"></i>
                </span>
                Categories
              </h5>
              <hr />
              <ul className="category-list">
                <li className={selectedCategory === "all" ? "active" : ""} onClick={() => setSelectedCategory("all")}>
                  All Products
                </li>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={selectedCategory === category ? "active" : ""}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Products Grid */}
          <Col md={9}>
            <div className="products-section">
              <div className="products-header">
                <h2>All Products</h2>
                <div className="products-count">{filteredProducts.length} products available</div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-5">
                  <h3>No products found</h3>
                  <p className="text-muted">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <Row xs={1} sm={2} md={3} className="g-4">
                  {filteredProducts.map((product) => (
                    <Col key={product.id}>
                      <div className="product-card">
                        <div className="product-image">
                          <img
                            src={`http://localhost:5010/uploads/${product.image}`}
                            alt={product.name}
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                            }}
                          />
                        </div>
                        <div className="product-category">{product.category}</div>
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">{product.description}</div>
                        <div className="product-footer">
                          <div className="product-price">₱{product.price}</div>
                          <div className={`product-stock ${getStockBackgroundColor(product.stock)}`}>
                            Stock: {product.stock}
                          </div>
                        </div>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                        >
                          ADD TO CART
                        </button>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Cart Notification */}
      {notification.show && (
        <div className="cart-notification">
          <div className="notification-content">
            <FaShoppingCart className="notification-icon" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      <Modal show={showCart} onHide={() => setShowCart(false)} size="xl" dialogClassName="cart-modal-wide modern-modal">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-modern">Your Shopping Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {cart.length === 0 ? (
            <div className="text-center py-5 empty-cart">
              <div className="empty-cart-icon">
                <FaShoppingCart size={48} className="text-muted mb-3" />
              </div>
              <h4>Your cart is empty</h4>
              <p className="text-muted">Add some products to your cart to continue shopping</p>
            </div>
          ) : (
            <>
              {getStockWarnings().length > 0 && (
                <Alert variant="warning" className="mb-4 stock-warning">
                  <strong>Stock Warning:</strong>
                  <ul className="mb-0 mt-1">
                    {getStockWarnings().map((warning) => (
                      <li key={warning.id}>
                        You've added all available stock ({warning.stock}) of "{warning.name}" to your cart.
                      </li>
                    ))}
                  </ul>
                </Alert>
              )}
              <div className="cart-items-container">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-details">
                      <div className="cart-item-image">
                        <img
                          src={`http://localhost:5010/uploads/${item.image}`}
                          alt={item.name}
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
                          }}
                        />
                      </div>
                      <div className="cart-item-info">
                        <h5 className="cart-item-name">{item.name}</h5>
                        <div className="cart-item-price">₱{item.price.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <div className="quantity-control modern">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <input
                          type="number"
                          className="quantity-input"
                          value={item.quantity}
                          min="1"
                          max={products.find((p) => p.id === item.id)?.stock || 999}
                          onChange={(e) => {
                            const newQuantity = Number.parseInt(e.target.value) || 1
                            updateQuantity(item.id, newQuantity)
                          }}
                        />
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="cart-item-subtotal">₱{(item.price * item.quantity).toLocaleString()}</div>
                      <Button variant="link" className="remove-btn" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total</span>
                  <span className="total-amount">₱{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowCart(false)}>
            Continue Shopping
          </Button>
          <Button
            variant="primary"
            className="checkout-btn"
            disabled={cart.length === 0}
            onClick={() => {
              setShowCart(false)
              setShowCheckout(true)
            }}
          >
            Proceed to Checkout
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Checkout Modal */}
      <Modal
        show={showCheckout}
        onHide={() => setShowCheckout(false)}
        size="xl"
        dialogClassName="cart-modal-wide modern-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="modal-title-modern">Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <div className="checkout-container">
            <Row>
              <Col md={7}>
                <div className="checkout-section">
                  <h5 className="section-title">Customer Information</h5>
                  <Form className="modern-form">
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        required
                        className="modern-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email (Optional)</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="modern-input"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Enter your phone number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        required
                        className="modern-input"
                      />
                    </Form.Group>
                  </Form>
                </div>

                <div className="checkout-section">
                  <h5 className="section-title">Payment Method</h5>
                  <div className="payment-methods modern">
                    <div
                      className={`payment-method-card ${paymentMethod === "cash" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <FaDollarSign size={24} />
                      <span>Cash</span>
                    </div>

                    <div
                      className={`payment-method-card ${paymentMethod === "e-wallet" ? "selected" : ""}`}
                      onClick={() => setPaymentMethod("e-wallet")}
                    >
                      <FaCreditCard size={24} />
                      <span>E-Wallet</span>
                    </div>
                  </div>

                  {/* QR Code for E-Wallet - Only show when e-wallet is selected */}
                  <div style={{display:"flex"}}>
                  {paymentMethod === "e-wallet" && (
                    <div className="qr-code-container">
                      <h6>Scan Gcash QR Code to Pay</h6>
                      <div className="qr-code-wrapper" style={{ width: "300px", height: "300px", padding: "0.5rem" }}>
                        <img
                          src="/public/images/gcashQR.jfif?height=300&width=300"
                          alt="E-Wallet QR Code"
                          className="qr-code-image"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  )}
                  {paymentMethod === "e-wallet" && (
                    <div className="qr-code-container">
                      <h6>Scan Paymaya QR Code to Pay</h6>
                      <div className="qr-code-wrapper" style={{ width: "300px", height: "300px", padding: "0.5rem" }}>
                        <img
                          src="/public/images/paymayaQR.jfif?height=300&width=300"
                          alt="E-Wallet QR Code"
                          className="qr-code-image"
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </div>
                    </div>
                  )}
                  </div>
                </div>
                
              </Col>

              <Col md={5}>
                <div className="checkout-section">
                  <h5 className="section-title">Order Summary</h5>
                  <div className="order-items">
                    {cart.map((item) => (
                      <div key={item.id} className="order-item">
                        <div className="order-item-info">
                          <span className="order-item-name">{item.name}</span>
                          <span className="order-item-quantity">x{item.quantity}</span>
                        </div>
                        <span className="order-item-price">₱{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-summary modern">
                    <div className="order-total">
                      <span>Total</span>
                      <span className="total-amount">₱{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" onClick={() => setShowCheckout(false)}>
            Back to Cart
          </Button>
          <Button variant="primary" className="complete-purchase-btn" onClick={handleCheckout}>
            Complete Purchase
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Receipt Modal */}
      <Modal show={showReceipt} onHide={() => setShowReceipt(false)} size="lg">
        <Modal.Header
          closeButton
          onHide={() => {
            setShowReceipt(false)
            fetchProducts() // Refresh products when receipt modal is closed
          }}
        >
          <Modal.Title>Purchase Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="receipt-content" className="receipt-container">
            <div className="receipt-header">
              <h2>CHARDOX MOTO PARTS & SERVICES</h2>
              <p>Contact: +639309655074</p>
              <p>
                Date: {orderDate.toLocaleDateString()} {orderDate.toLocaleTimeString()}
              </p>
            </div>

            <div className="receipt-customer-info">
              <h5>Customer Information</h5>
              <p>
                <strong>Name:</strong> {customerInfo.name}
              </p>
              <p>
                <strong>Phone:</strong> {customerInfo.phone}
              </p>
              {customerInfo.email && (
                <p>
                  <strong>Email:</strong> {customerInfo.email}
                </p>
              )}
            </div>

            <div className="receipt-items">
              <h5>Purchased Items</h5>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>₱{item.price.toLocaleString()}</td>
                      <td>{item.quantity}</td>
                      <td>₱{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end fw-bold">
                      Total:
                    </td>
                    <td className="fw-bold">₱{calculateTotal().toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="receipt-payment">
              <p>
                <strong>Payment Method:</strong> {paymentMethod === "cash" ? "Cash" : "E-Wallet"}
              </p>
            </div>

            <div className="receipt-footer">
              <p>Thank you for your purchase!</p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={downloadReceipt}>
            <FaDownload size={16} className="me-2" />
            Download Receipt
          </Button>
          <Button variant="primary" onClick={resetTransaction}>
            <FaRedo size={16} className="me-2" />
            New Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ClientStore
