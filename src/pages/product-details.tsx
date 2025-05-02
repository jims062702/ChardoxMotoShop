"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Heart, ShoppingCart, ArrowLeft, Star, Truck, Shield } from "lucide-react"
import { useCart } from "../context/cart-context"
import { useWishlist } from "../context/wishlist-context"
import "../styles/ProductDetails.css"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [relatedProducts, setRelatedProducts] = useState([])

  const inWishlist = product ? isInWishlist(product.id) : false

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    setIsLoading(true)
    setError("")

    try {
      // This would be replaced with your actual API call
      // For now, simulate API call with timeout
      setTimeout(() => {
        // Mock product data
        const mockProduct = {
          id: Number.parseInt(id),
          name: "High Performance Motorcycle Engine Oil",
          price: 1200,
          stock: 15,
          image: "engine-oil.jpg",
          description:
            "Premium synthetic engine oil specially formulated for high-performance motorcycles. Provides superior protection against wear, heat, and deposits while ensuring smooth shifting and proper clutch operation.",
          category: "Engine",
          specifications: [
            { name: "Volume", value: "1 Liter" },
            { name: "Type", value: "Fully Synthetic" },
            { name: "Viscosity", value: "10W-40" },
            { name: "API Rating", value: "SN" },
            { name: "JASO Rating", value: "MA2" },
          ],
          rating: 4.7,
          reviewCount: 28,
        }

        setProduct(mockProduct)

        // Mock related products
        const mockRelated = [
          {
            id: 101,
            name: "Oil Filter",
            price: 350,
            stock: 20,
            image: "oil-filter.jpg",
            category: "Engine",
          },
          {
            id: 102,
            name: "Air Filter",
            price: 450,
            stock: 8,
            image: "air-filter.jpg",
            category: "Engine",
          },
          {
            id: 103,
            name: "Spark Plugs (Set of 4)",
            price: 800,
            stock: 12,
            image: "spark-plugs.jpg",
            category: "Engine",
          },
        ]

        setRelatedProducts(mockRelated)
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error fetching product details:", error)
      setError("Failed to load product details. Please try again.")
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0 && product && value <= product.stock) {
      setQuantity(value)
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      stock: product.stock,
    })

    // Show toast notification
    const toast = document.createElement("div")
    toast.className = "toast-notification show"
    toast.innerHTML = `
      <div class="toast-content">
        <i class="bi bi-check-circle-fill text-success me-2"></i>
        ${product.name} added to cart
      </div>
    `
    document.body.appendChild(toast)

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.className = toast.className.replace("show", "")
      setTimeout(() => {
        document.body.removeChild(toast)
      }, 500)
    }, 3000)
  }

  const handleToggleWishlist = () => {
    if (!product) return

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      })
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="star filled" size={16} />)
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="star half-filled" size={16} />)
    }

    const remainingStars = 5 - stars.length
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star" size={16} />)
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className="product-details-container">
        <div className="container py-5">
          <div className="product-details-skeleton">
            <div className="row">
              <div className="col-md-6">
                <div className="skeleton-image"></div>
              </div>
              <div className="col-md-6">
                <div className="skeleton-title"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="product-details-container">
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-details-container">
        <div className="container py-5">
          <div className="alert alert-warning" role="alert">
            Product not found
          </div>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} className="me-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-details-container">
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/client-dashboard">Home</a>
            </li>
            <li className="breadcrumb-item">
              <a href={`/category/${product.category}`}>{product.category}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Product Image */}
          <div className="col-md-6 mb-4">
            <div className="product-image-container">
              <img
                src={`http://localhost:5010/uploads/${product.image}`}
                alt={product.name}
                className="img-fluid rounded"
                onError={(e) => {
                  e.target.onerror = null
                  ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=600"
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="col-md-6">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating mb-3">
              <div className="stars">{renderStars(product.rating)}</div>
              <span className="rating-text">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="product-price mb-4">₱{product.price.toLocaleString()}</div>

            <div className="product-description mb-4">
              <p>{product.description}</p>
            </div>

            <div className="product-stock mb-3">
              <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="product-quantity mb-4">
                <label htmlFor="quantity" className="form-label">
                  Quantity:
                </label>
                <div className="quantity-input">
                  <button className="btn btn-outline-secondary" onClick={decrementQuantity} disabled={quantity <= 1}>
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    className="form-control"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stock}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="product-actions mb-4">
              <button className="btn btn-primary btn-lg me-2" onClick={handleAddToCart} disabled={product.stock <= 0}>
                <ShoppingCart size={20} className="me-2" />
                Add to Cart
              </button>

              <button
                className={`btn btn-outline-secondary btn-lg wishlist-btn ${inWishlist ? "active" : ""}`}
                onClick={handleToggleWishlist}
              >
                <Heart className={inWishlist ? "fill-heart" : ""} size={20} />
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            <div className="product-features mb-4">
              <div className="feature">
                <Truck size={20} />
                <div>
                  <h6>Free Shipping</h6>
                  <p className="mb-0">On orders over ₱5,000</p>
                </div>
              </div>
              <div className="feature">
                <Shield size={20} />
                <div>
                  <h6>1 Year Warranty</h6>
                  <p className="mb-0">Manufacturer warranty</p>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="product-specifications">
              <h5>Specifications</h5>
              <table className="table table-sm">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <th>{spec.name}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products mt-5">
            <h3 className="mb-4">Related Products</h3>
            <div className="row">
              {relatedProducts.map((item) => (
                <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={item.id}>
                  <div className="product-card" onClick={() => navigate(`/product/${item.id}`)}>
                    <div className="product-badge">{item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}</div>
                    <div className="product-image">
                      <img
                        src={`http://localhost:5010/uploads/${item.image}`}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                        }}
                      />
                    </div>
                    <div className="product-content">
                      <h5 className="product-title">{item.name}</h5>
                      <div className="product-price">₱{item.price.toLocaleString()}</div>
                      <button className="btn btn-primary w-100" disabled={item.stock <= 0}>
                        {item.stock > 0 ? (
                          <>
                            <ShoppingCart size={16} className="me-2" />
                            View Details
                          </>
                        ) : (
                          "Out of Stock"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails

