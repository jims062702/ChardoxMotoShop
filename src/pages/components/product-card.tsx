"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { Heart, ShoppingCart } from "lucide-react"
import { useCart } from "../../context/cart-context"
import { useWishlist } from "../../context/wishlist-context"

type ProductCardProps = {
  item: {
    id: number
    name: string
    price: number
    stock: number
    image: string
    description?: string
    category?: string
  }
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWishlist = isInWishlist(item.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigating to product details

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent navigating to product details

    if (inWishlist) {
      removeFromWishlist(item.id)
    } else {
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        stock: item.stock,
      })
    }
  }

  const viewProductDetails = () => {
    navigate(`/product/${item.id}`)
  }

  return (
    <div className="product-card" onClick={viewProductDetails}>
      <div className="product-badge">{item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}</div>
      <button
        className={`wishlist-button ${inWishlist ? "active" : ""}`}
        onClick={handleToggleWishlist}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={inWishlist ? "fill-heart" : ""} size={18} />
      </button>
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
        <button className="btn btn-primary w-100" onClick={handleAddToCart} disabled={item.stock <= 0}>
          {item.stock > 0 ? (
            <>
              <ShoppingCart size={16} className="me-2" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </div>
  )
}

export default ProductCard

