"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

// Define types
export type WishlistItem = {
  id: number
  name: string
  price: number
  image: string
  stock: number
}

type WishlistContextType = {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (itemId: number) => void
  isInWishlist: (itemId: number) => boolean
  getWishlistCount: () => number
}

// Create context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Create provider component
export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Error parsing wishlist from localStorage:", error)
      }
    }
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems))
  }, [wishlistItems])

  // Add item to wishlist
  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prevItems) => {
      // Check if item already exists in wishlist
      const existingItem = prevItems.find((wishlistItem) => wishlistItem.id === item.id)

      if (existingItem) {
        // Item already in wishlist, do nothing
        return prevItems
      } else {
        // Item doesn't exist, add it
        return [...prevItems, item]
      }
    })
  }

  // Remove item from wishlist
  const removeFromWishlist = (itemId: number) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  // Check if item is in wishlist
  const isInWishlist = (itemId: number) => {
    return wishlistItems.some((item) => item.id === itemId)
  }

  // Get total number of items in wishlist
  const getWishlistCount = () => {
    return wishlistItems.length
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// Custom hook to use the wishlist context
export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

