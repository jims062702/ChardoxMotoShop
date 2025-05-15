import express from "express"
import { db } from "../server.js"

const router = express.Router()

// Completely rewritten GET route to display each item on a separate row with its own ID
router.get("/", async (req, res) => {
  try {
    console.log("🔍 Fetching sales records from the database...")

    // Get all sales with their items and quantities directly in a single query
    const [salesItems] = await db.promise().query(`
      SELECT 
        s.id as originalSaleId, 
        s.customer, 
        s.total_amount as totalAmount, 
        s.sale_date as date,
        s.payment_method as paymentMethod,
        s.status,
        si.item_name as itemName,
        si.quantity as quantity,
        si.id as id
      FROM sales s
      JOIN sale_items si ON s.id = si.sale_id
      ORDER BY s.sale_date DESC, s.id DESC
    `)

    // Process the results but preserve the original quantities
    if (salesItems.length > 0) {
      const processedItems = []
      let newId = 1

      for (const item of salesItems) {
        // Only split if necessary and preserve the original quantity
        if (item.itemName && item.itemName.includes(",") && !item.quantity) {
          // This case should rarely happen - only if quantity is missing
          const itemNames = item.itemName
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name)

          for (const name of itemNames) {
            processedItems.push({
              id: newId++,
              originalSaleId: item.originalSaleId,
              customer: item.customer,
              totalAmount: item.totalAmount,
              date: item.date,
              paymentMethod: item.paymentMethod,
              status: item.status || "Completed",
              itemName: name,
              quantity: 1, // Default quantity for split items
            })
          }
        } else {
          // Keep the original item with its quantity intact
          processedItems.push({
            ...item,
            id: newId++,
            status: item.status || "Completed",
          })
        }
      }

      console.log("✅ Processed sales data:", processedItems)
      return res.json(processedItems)
    }

    console.log("✅ Sales items fetched successfully:", salesItems)
    res.json(salesItems)
  } catch (error) {
    console.error("❌ Database Error:", error.message)
    res.status(500).json({ error: "Failed to fetch sales", details: error.message })
  }
})

// Add a new sale
router.post("/add", async (req, res) => {
  const { customer, items, totalAmount, paymentMethod, date, orderId, status } = req.body

  if (!customer || !items || !totalAmount || !paymentMethod) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  try {
    // Ensure required columns exist
    await db.promise().query(`
      ALTER TABLE sales 
      ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) NOT NULL,
      ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'Completed'
    `)

    // Start a transaction
    await db.promise().query("START TRANSACTION")

    // Insert the sale record (if orderId exists, include it)
    const [result] = await db.promise().query(
      `INSERT INTO sales (customer, total_amount, payment_method, sale_date, order_id, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customer, totalAmount, paymentMethod, date, orderId || null, status || "Completed"],
    )

    const saleId = result.insertId

    // Insert each item in the sale as a separate record
    for (const item of items) {
      await db.promise().query(
        `INSERT INTO sale_items (sale_id, item_id, item_name, price, quantity) 
         VALUES (?, ?, ?, ?, ?)`,
        [saleId, item.id, item.name, item.price, item.quantity],
      )

      // Update inventory (reduce stock)
      await db.promise().query("UPDATE products SET stock = stock - ? WHERE id = ?", [item.quantity, item.id])
    }

    // Commit the transaction
    await db.promise().query("COMMIT")

    res.status(201).json({
      message: "Sale recorded successfully",
      saleId,
    })
  } catch (error) {
    // Rollback in case of error
    await db.promise().query("ROLLBACK")
    console.error("❌ Database Error:", error)
    res.status(500).json({ error: "Failed to record sale", details: error.message })
  }
})

// Add a new endpoint to update sale status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ error: "Status is required" })
  }

  try {
    const [result] = await db.promise().query("UPDATE sales SET status = ? WHERE id = ?", [status, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Sale not found" })
    }

    res.json({
      message: "Status updated successfully",
      saleId: id,
      status,
    })
  } catch (error) {
    console.error("❌ Database Error:", error)
    res.status(500).json({ error: "Failed to update status", details: error.message })
  }
})

// Get details of a specific sale
router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    // Get sale information
    const [sales] = await db.promise().query("SELECT * FROM sales WHERE id = ?", [id])

    if (sales.length === 0) {
      return res.status(404).json({ error: "Sale not found" })
    }

    // Get items in the sale
    const [items] = await db.promise().query("SELECT * FROM sale_items WHERE sale_id = ?", [id])

    res.json({
      ...sales[0],
      items,
    })
  } catch (error) {
    console.error("❌ Database Error:", error)
    res.status(500).json({ error: "Failed to fetch sale details" })
  }
})

export default router
