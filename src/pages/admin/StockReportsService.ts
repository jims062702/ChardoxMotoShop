// This service file will help keep data in sync between Inventory Dashboard and Stock Reports

export interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  image?: string
  last_restock_date?: string
  description?: string
}

export interface StockReport {
  id: number
  productId: number
  productName: string
  category: string
  lastRestockedDate: string
  reportDate: string
  unitPrice: number
  stock: number
  image?: string
}

export interface ItemAddedReport {
  id: number
  productId: number
  productName: string
  category: string
  quantity: number
  unitPrice: number
  totalValue: number
  addedDate: string
  addedBy: string
  image?: string
  description?: string
}

export interface ItemRemovedReport {
  id: number
  productId: number
  productName: string
  category: string
  quantity: number
  unitPrice: number
  totalValue: number
  removedDate: string
  removedBy: string
  reason: string
  image?: string
}

// Mock data for fallback when API fails
const mockProducts: Product[] = [
  {
    id: 46,
    name: "Side Mirror",
    category: "Body Parts",
    price: 2.0,
    stock: 2,
    image: "1746328627264-1.jpg",
    last_restock_date: "2025-05-15",
  },
  {
    id: 48,
    name: "Super Heavy Duty brake fluid dot 3 900ml",
    category: "Brakes",
    price: 1.0,
    stock: 2,
    image: "1744602365789-4.webp",
    last_restock_date: "2025-05-10",
  },
  {
    id: 49,
    name: "Spark Plug",
    category: "Engine Parts",
    price: 1.0,
    stock: 0,
    image: "1744602894711-sg-11134201-7rd5c-lx6c0novatpldb.webp",
    last_restock_date: "2025-05-05",
  },
  {
    id: 50,
    name: "MISHIBA FRONT FORK XRM 125 LH/RH 1 SET",
    category: "Suspension",
    price: 1.0,
    stock: 41,
    image: "1744603074610-ph-11134207-7rasl-m5mm19sa5mdecb.webp",
    last_restock_date: "2025-05-18",
  },
  {
    id: 51,
    name: "Rear Shock",
    category: "Suspension",
    price: 1.0,
    stock: 33,
    image: "1744603144114-925a92d46aeb7a027837f24121fdebbc.webp",
    last_restock_date: "2025-05-12",
  },
  {
    id: 52,
    name: "Clutch Cable Tmx155 Takasago Brand",
    category: "Transmission",
    price: 1.0,
    stock: 10,
    image: "1744603236918-ph-11134207-7r98s-lws21eop3wuc21.webp",
    last_restock_date: "2025-05-08",
  },
  {
    id: 53,
    name: "Universal 110CM CARBON FIBER CLUTCH CABLE",
    category: "Transmission",
    price: 1.0,
    stock: 20,
    image: "1744603309094-ph-11134207-7rasm-m63u28kd1h8i8b.webp",
    last_restock_date: "2025-05-14",
  },
  {
    id: 54,
    name: "CHAIN SPROCKET SET for XRM/WAVE/SMASH",
    category: "Transmission",
    price: 1.0,
    stock: 20,
    image: "1744603408712-7fd83c66840c726bdd3d75232aa79a56.webp",
    last_restock_date: "2025-05-11",
  },
  {
    id: 55,
    name: "Shell Fully Synthetic Motorcycle Oil - Long Ride 10W-40 1L",
    category: "Cooling System",
    price: 1.0,
    stock: 20,
    image: "1744603617603-sg-11134253-7rd4k-m6srcqpe26n588.webp",
    last_restock_date: "2025-05-19",
  },
  {
    id: 56,
    name: "Bosch Halogen Bulb H4 60/55W",
    category: "Electrical",
    price: 1.0,
    stock: 20,
    image: "1744603804608-3f25d40faef482cca0fe4fbc094f30bc.webp",
    last_restock_date: "2025-05-20",
  },
  {
    id: 57,
    name: "Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard",
    category: "Accessories",
    price: 50.0,
    stock: 0,
    image: "1745228577381-3f25d40faef482cca0fe4fbc094f30bc.webp",
    last_restock_date: "2025-05-17",
  },
  {
    id: 60,
    name: "Example",
    category: "Accessories",
    price: 1.0,
    stock: 143,
    image: "1746356747363-4.webp",
    last_restock_date: "2025-05-16",
  },
]

// Mock data for item additions
const mockItemAddedReports: ItemAddedReport[] = [
  {
    id: 1,
    productId: 46,
    productName: "Side Mirror",
    category: "Body Parts",
    quantity: 5,
    unitPrice: 2.0,
    totalValue: 10.0,
    addedDate: "2025-01-29T14:30:00Z",
    addedBy: "Admin",
    image: "1746328627264-1.jpg",
    description: "New stock arrival",
  },
  {
    id: 2,
    productId: 48,
    productName: "Super Heavy Duty brake fluid dot 3 900ml",
    category: "Brakes",
    quantity: 10,
    unitPrice: 1.0,
    totalValue: 10.0,
    addedDate: "2025-01-29T10:15:00Z",
    addedBy: "Admin",
    image: "1744602365789-4.webp",
    description: "Restocked inventory",
  },
  {
    id: 3,
    productId: 50,
    productName: "MISHIBA FRONT FORK XRM 125 LH/RH 1 SET",
    category: "Suspension",
    quantity: 20,
    unitPrice: 1.0,
    totalValue: 20.0,
    addedDate: "2025-01-28T16:45:00Z",
    addedBy: "Admin",
    image: "1744603074610-ph-11134207-7rasl-m5mm19sa5mdecb.webp",
    description: "Bulk purchase",
  },
]

// Mock data for item removals
const mockItemRemovedReports: ItemRemovedReport[] = [
  {
    id: 1,
    productId: 49,
    productName: "Spark Plug",
    category: "Engine Parts",
    quantity: 15,
    unitPrice: 1.0,
    totalValue: 15.0,
    removedDate: "2025-01-29T09:20:00Z",
    removedBy: "Admin",
    reason: "Defective items",
    image: "1744602894711-sg-11134201-7rd5c-lx6c0novatpldb.webp",
  },
  {
    id: 2,
    productId: 57,
    productName: "Bosch Halogen Bulb H4 60/55W 9003 HB2 12V Standard",
    category: "Accessories",
    quantity: 25,
    unitPrice: 50.0,
    totalValue: 1250.0,
    removedDate: "2025-01-28T11:30:00Z",
    removedBy: "Admin",
    reason: "Discontinued product",
    image: "1745228577381-3f25d40faef482cca0fe4fbc094f30bc.webp",
  },
]

// Shared data store for products
let cachedProducts: Product[] = []
let cachedItemAddedReports: ItemAddedReport[] = []
let cachedItemRemovedReports: ItemRemovedReport[] = []
let lastFetchTime = 0
const CACHE_DURATION = 30000 // 30 seconds

// Function to fetch products from API - updated to use the correct endpoint based on your files
export const fetchProducts = async (): Promise<Product[]> => {
  const currentTime = Date.now()

  // Use cached data if it's fresh enough
  if (cachedProducts.length > 0 && currentTime - lastFetchTime < CACHE_DURATION) {
    return cachedProducts
  }

  try {
    // Try multiple possible endpoints
    const endpoints = [
      "http://localhost:5010/api/parts/get-parts",
      "http://localhost:5010/api/products",
      "http://localhost:5010/api/products/all",
      "http://localhost:5010/api/inventory",
    ]

    let data = null
    let successEndpoint = ""

    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, { credentials: "include" })
        if (response.ok) {
          data = await response.json()
          successEndpoint = endpoint
          break
        }
      } catch (err) {
        console.warn(`Endpoint ${endpoint} failed:`, err)
        // Continue to next endpoint
      }
    }

    // If we got data from any endpoint, use it
    if (data && Array.isArray(data)) {
      console.log(`Successfully fetched products from ${successEndpoint}`)
      cachedProducts = data
      lastFetchTime = currentTime
      return data
    }

    // If all endpoints failed, throw error to trigger fallback
    throw new Error("All API endpoints failed")
  } catch (error) {
    console.error("Error fetching products:", error)

    // Use mock data as fallback
    console.log("Using mock product data as fallback")
    cachedProducts = mockProducts
    lastFetchTime = currentTime
    return mockProducts
  }
}

// Function to fetch item added reports
export const fetchItemAddedReports = async (): Promise<ItemAddedReport[]> => {
  try {
    const response = await fetch("http://localhost:5010/api/reports/item-added", { credentials: "include" })
    if (response.ok) {
      const data = await response.json()
      cachedItemAddedReports = data
      return data
    }
    throw new Error("Failed to fetch item added reports")
  } catch (error) {
    console.error("Error fetching item added reports:", error)
    console.log("Using mock item added reports as fallback")
    cachedItemAddedReports = mockItemAddedReports
    return mockItemAddedReports
  }
}

// Function to fetch item removed reports
export const fetchItemRemovedReports = async (): Promise<ItemRemovedReport[]> => {
  try {
    const response = await fetch("http://localhost:5010/api/reports/item-removed", { credentials: "include" })
    if (response.ok) {
      const data = await response.json()
      cachedItemRemovedReports = data
      return data
    }
    throw new Error("Failed to fetch item removed reports")
  } catch (error) {
    console.error("Error fetching item removed reports:", error)
    console.log("Using mock item removed reports as fallback")
    cachedItemRemovedReports = mockItemRemovedReports
    return mockItemRemovedReports
  }
}

// Function to record item addition
export const recordItemAddition = async (item: Omit<ItemAddedReport, "id">): Promise<void> => {
  try {
    const response = await fetch("http://localhost:5010/api/reports/record-addition", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      throw new Error("Failed to record item addition")
    }

    // Invalidate cache to force refresh
    invalidateCache()
  } catch (error) {
    console.error("Error recording item addition:", error)
    // In a real app, you might want to store this locally and sync later
  }
}

// Function to record item removal
export const recordItemRemoval = async (item: Omit<ItemRemovedReport, "id">): Promise<void> => {
  try {
    const response = await fetch("http://localhost:5010/api/reports/record-removal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(item),
    })

    if (!response.ok) {
      throw new Error("Failed to record item removal")
    }

    // Invalidate cache to force refresh
    invalidateCache()
  } catch (error) {
    console.error("Error recording item removal:", error)
    // In a real app, you might want to store this locally and sync later
  }
}

// Function to convert products to stock reports
export const convertToReports = (products: Product[]): StockReport[] => {
  return products.map((product, index) => ({
    id: index + 1,
    productId: product.id,
    productName: product.name,
    category: product.category || "Uncategorized",
    lastRestockedDate: product.last_restock_date || new Date().toISOString().split("T")[0],
    reportDate: new Date().toISOString().split("T")[0],
    unitPrice: product.price,
    stock: product.stock,
    image: product.image,
  }))
}

// Function to fetch categories
export const fetchCategories = async (): Promise<string[]> => {
  try {
    // Try to fetch categories from API
    const response = await fetch("http://localhost:5010/api/categories", { credentials: "include" })
    if (!response.ok) throw new Error("Failed to fetch categories")

    const data = await response.json()
    return data.map((cat) => cat.name)
  } catch (error) {
    console.error("Error fetching categories:", error)

    // Extract unique categories from products
    const products = await fetchProducts()
    if (products.length > 0) {
      return [...new Set(products.map((product) => product.category || "Uncategorized"))]
    }

    // Fallback to common motorcycle part categories
    return [
      "Engine Parts",
      "Body Parts",
      "Electrical",
      "Brakes",
      "Suspension",
      "Transmission",
      "Accessories",
      "Cooling System",
    ]
  }
}

// Function to invalidate cache and force refresh
export const invalidateCache = (): void => {
  lastFetchTime = 0
}
