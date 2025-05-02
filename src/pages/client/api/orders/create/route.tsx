import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request) {
  const { items, customer, total } = await request.json()

  // Get user ID from cookies or session
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value || "guest"

  // In a real application, you would:
  // 1. Create an order in the database
  // 2. Update stock levels for each item
  // 3. Clear the user's cart

  // For this example, we'll update our in-memory stock
  const stockStore = global.stockStore || new Map()

  // Update stock for each item
  for (const item of items) {
    const stockItem = stockStore.get(item.id)

    if (stockItem) {
      // Reduce stock by the quantity ordered
      stockItem.stock = Math.max(0, stockItem.stock - item.quantity)
      stockStore.set(item.id, stockItem)
    }
  }

  // Create an order record (in a real app, this would go to a database)
  const order = {
    id: Date.now().toString(),
    userId,
    items,
    customer,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  // In a real app, you would save this to a database
  console.log("Order created:", order)

  return NextResponse.json({ success: true, orderId: order.id })
}

