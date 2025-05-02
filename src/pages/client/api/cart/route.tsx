import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// This would connect to your database in a real application
// For now, we'll use a simple in-memory store
const cartStore = new Map()
const stockStore = new Map()

// Initialize some sample stock data
if (stockStore.size === 0) {
  stockStore.set(1, { id: 1, name: "Motorcycle Engine Oil", price: 1200, stock: 10, image: "engine-oil.jpg" })
  stockStore.set(2, { id: 2, name: "Brake Pads", price: 850, stock: 15, image: "brake-pads.jpg" })
  stockStore.set(3, { id: 3, name: "Air Filter", price: 450, stock: 8, image: "air-filter.jpg" })
}

export async function GET(request) {
  // Get user ID from cookies or session
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value || "guest"

  // Get cart for this user
  const userCart = cartStore.get(userId) || []

  // Enrich cart items with current stock information
  const enrichedCart = userCart.map((item) => {
    const stockItem = stockStore.get(item.id)
    return {
      ...item,
      stock: stockItem ? stockItem.stock : 0,
    }
  })

  return NextResponse.json(enrichedCart)
}

export async function PUT(request) {
  const { itemId, quantity } = await request.json()

  // Get user ID from cookies or session
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value || "guest"

  // Get cart for this user
  const userCart = cartStore.get(userId) || []

  // Find the item in the cart
  const itemIndex = userCart.findIndex((item) => item.id === itemId)

  if (itemIndex >= 0) {
    // Get current stock
    const stockItem = stockStore.get(itemId)

    if (!stockItem) {
      return NextResponse.json({ error: "Item not found in stock" }, { status: 404 })
    }

    // Ensure quantity doesn't exceed stock
    const safeQuantity = Math.min(quantity, stockItem.stock)

    // Update the item quantity
    userCart[itemIndex].quantity = safeQuantity

    // Save the updated cart
    cartStore.set(userId, userCart)

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
}

export async function DELETE(request) {
  const { itemId } = await request.json()

  // Get user ID from cookies or session
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value || "guest"

  // Get cart for this user
  let userCart = cartStore.get(userId) || []

  // Remove the item from the cart
  userCart = userCart.filter((item) => item.id !== itemId)

  // Save the updated cart
  cartStore.set(userId, userCart)

  return NextResponse.json({ success: true })
}

