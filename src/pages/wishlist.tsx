"use client"
import { useNavigate } from "react-router-dom"
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { useWishlist } from "../context/wishlist-context"
import { useCart } from "../context/cart-context"
import "../styles/Wishlist.css"

const Wishlist = () => {
  const navigate = useNavigate()
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      stock: item.stock,
    })

    // Show toast notification
    const toast = document.createElement("div")
    toast.className = "toast-notification show"
    toast.innerHTML = `
      <div class="toast-content">
        <i class="bi bi-check-circle-fill text-success me-2"></i>
        ${item.name} added to cart
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

  return (
    <div className="wishlist-container">
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fw-bold">My Wishlist</h1>
              <button className="btn btn-outline-secondary" onClick={() => navigate("/client-dashboard")}>
                <ArrowLeft size={16} className="me-2" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-heart display-1 text-muted"></i>
            <h3 className="mt-3">Your wishlist is empty</h3>
            <p className="text-muted mb-4">Save items you like for future reference</p>
            <button className="btn btn-primary" onClick={() => navigate("/client-dashboard")}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="row">
            {wishlistItems.map((item) => (
              <div className="col-sm-6 col-md-4 col-lg-3 mb-4" key={item.id}>
                <div className="wishlist-card">
                  <div className="wishlist-image" onClick={() => navigate(`/product/${item.id}`)}>
                    <img
                      src={`http://localhost:5010/uploads/${item.image}`}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=200&width=200"
                      }}
                    />
                  </div>
                  <div className="wishlist-content">
                    <h5 className="wishlist-title" onClick={() => navigate(`/product/${item.id}`)}>
                      {item.name}
                    </h5>
                    <div className="wishlist-price">₱{item.price.toLocaleString()}</div>
                    <div className="wishlist-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(item)}
                        disabled={item.stock <= 0}
                      >
                        <ShoppingCart size={16} className="me-2" />
                        Add to Cart
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => removeFromWishlist(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist

