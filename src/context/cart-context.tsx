"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:5010/api/cart/items", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data)
      }
    } catch (error) {
      console.error("Failed to fetch cart items:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (item) => {
    try {
      // Check if item is already in cart
      const existingItem = cartItems.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // If already in cart, increase quantity
        await updateQuantity(item.id, existingItem.quantity + 1)
      } else {
        // Add new item to cart
        const newItem = { ...item, quantity: 1 }

        // In a real app, you would call an API to add the item
        const response = await fetch("http://localhost:5010/api/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newItem),
        })

        if (response.ok) {
          setCartItems([...cartItems, newItem])
        }
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return

    try {
      // Find the item to check stock
      const item = cartItems.find((item) => item.id === itemId)
      if (!item) return

      // Don't exceed available stock
      const safeQuantity = Math.min(quantity, item.stock)

      // Update quantity in the backend
      const response = await fetch(`http://localhost:5010/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId, quantity: safeQuantity }),
      })

      if (response.ok) {
        // Update local state
        const updatedItems = cartItems.map((item) => {
          if (item.id === itemId) {
            return { ...item, quantity: safeQuantity }
          }
          return item
        })

        setCartItems(updatedItems)
      }
    } catch (error) {
      console.error("Failed to update cart:", error)
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      // Remove item from backend
      const response = await fetch(`http://localhost:5010/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      })

      if (response.ok) {
        // Update local state
        const updatedItems = cartItems.filter((item) => item.id !== itemId)
        setCartItems(updatedItems)
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const clearCart = async () => {
    try {
      // Clear cart in backend
      const response = await fetch(`http://localhost:5010/api/cart/clear`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        // Update local state
        setCartItems([])
      }
    } catch (error) {
      console.error("Failed to clear cart:", error)
    }
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    refreshCart: fetchCartItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

