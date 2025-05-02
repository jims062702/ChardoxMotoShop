import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Get user ID from cookies or session
  const cookieStore = cookies()
  const userId = cookieStore.get("userId")?.value || "guest"

  // Clear the user's cart
  const cartStore = global.cartStore || new Map()
  cartStore.set(userId, [])

  return NextResponse.json({ success: true })
}

