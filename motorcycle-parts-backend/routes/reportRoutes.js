import express from "express"
import { db } from "../server.js"

const router = express.Router()

// Get all item addition/reduction reports (renamed from item-added to be more accurate)
router.get("/item-added", async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        id,
        product_id as productId,
        product_name as productName,
        category,
        quantity,
        previous_stock as previousStock,
        new_stock as newStock,
        unit_price as unitPrice,
        total_value as totalValue,
        added_by as addedBy,
        description,
        image,
        change_type as changeType,
        added_date as addedDate
      FROM item_additions 
      ORDER BY added_date DESC
    `)

    console.log("✅ Fetched stock changes:", results.length, "records")
    res.json(results)
  } catch (error) {
    console.error("❌ Error fetching stock change reports:", error)
    res.status(500).json({ error: "Failed to fetch stock change reports", details: error.message })
  }
})

// Get only stock increases
router.get("/item-increases", async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        id,
        product_id as productId,
        product_name as productName,
        category,
        quantity,
        previous_stock as previousStock,
        new_stock as newStock,
        unit_price as unitPrice,
        total_value as totalValue,
        added_by as addedBy,
        description,
        image,
        change_type as changeType,
        added_date as addedDate
      FROM item_additions 
      WHERE change_type IN ('increase', 'new_item')
      ORDER BY added_date DESC
    `)

    console.log("✅ Fetched stock increases:", results.length, "records")
    res.json(results)
  } catch (error) {
    console.error("❌ Error fetching stock increase reports:", error)
    res.status(500).json({ error: "Failed to fetch stock increase reports", details: error.message })
  }
})

// Get only stock decreases
router.get("/item-decreases", async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        id,
        product_id as productId,
        product_name as productName,
        category,
        quantity,
        previous_stock as previousStock,
        new_stock as newStock,
        unit_price as unitPrice,
        total_value as totalValue,
        added_by as addedBy,
        description,
        image,
        change_type as changeType,
        added_date as addedDate
      FROM item_additions 
      WHERE change_type = 'decrease'
      ORDER BY added_date DESC
    `)

    console.log("✅ Fetched stock decreases:", results.length, "records")
    res.json(results)
  } catch (error) {
    console.error("❌ Error fetching stock decrease reports:", error)
    res.status(500).json({ error: "Failed to fetch stock decrease reports", details: error.message })
  }
})

// Get all item removal reports (deletions)
router.get("/item-removed", async (req, res) => {
  try {
    const [results] = await db.promise().query(`
      SELECT 
        id,
        product_id as productId,
        product_name as productName,
        category,
        quantity,
        unit_price as unitPrice,
        total_value as totalValue,
        removed_by as removedBy,
        reason,
        image,
        removed_date as removedDate
      FROM item_removals 
      ORDER BY removed_date DESC
    `)

    console.log("✅ Fetched item removals:", results.length, "records")
    res.json(results)
  } catch (error) {
    console.error("❌ Error fetching item removal reports:", error)
    res.status(500).json({ error: "Failed to fetch item removal reports", details: error.message })
  }
})

// Record stock change manually (for cases not covered by triggers)
router.post("/record-addition", async (req, res) => {
  try {
    const {
      productId,
      productName,
      category,
      quantity,
      previousStock,
      newStock,
      unitPrice,
      totalValue,
      addedBy,
      description,
      image,
      changeType,
    } = req.body

    const [result] = await db.promise().query(
      `
      INSERT INTO item_additions (
        product_id, product_name, category, quantity, previous_stock, new_stock,
        unit_price, total_value, added_by, description, image, change_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        productId,
        productName,
        category,
        quantity,
        previousStock || 0,
        newStock || quantity,
        unitPrice,
        totalValue,
        addedBy || "Admin",
        description,
        image,
        changeType || (quantity > 0 ? "increase" : "decrease"),
      ],
    )

    console.log("✅ Manually recorded stock change:", result.insertId)
    res.status(201).json({
      message: "Stock change recorded successfully",
      id: result.insertId,
    })
  } catch (error) {
    console.error("❌ Error recording stock change:", error)
    res.status(500).json({ error: "Failed to record stock change", details: error.message })
  }
})

// Record item removal
router.post("/record-removal", async (req, res) => {
  try {
    const { productId, productName, category, quantity, unitPrice, totalValue, removedBy, reason, image } = req.body

    const [result] = await db.promise().query(
      `
      INSERT INTO item_removals (
        product_id, product_name, category, quantity, 
        unit_price, total_value, removed_by, reason, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [productId, productName, category, quantity, unitPrice, totalValue, removedBy || "Admin", reason, image],
    )

    console.log("✅ Manually recorded item removal:", result.insertId)
    res.status(201).json({
      message: "Item removal recorded successfully",
      id: result.insertId,
    })
  } catch (error) {
    console.error("❌ Error recording item removal:", error)
    res.status(500).json({ error: "Failed to record item removal", details: error.message })
  }
})

// Test endpoint to check if tables exist
router.get("/test-tables", async (req, res) => {
  try {
    // Check if tables exist
    const [additionsTable] = await db.promise().query("SHOW TABLES LIKE 'item_additions'")
    const [removalsTable] = await db.promise().query("SHOW TABLES LIKE 'item_removals'")

    // Get table structures
    const [additionsStructure] = await db.promise().query("DESCRIBE item_additions")
    const [removalsStructure] = await db.promise().query("DESCRIBE item_removals")

    // Get sample data
    const [additionsSample] = await db.promise().query("SELECT * FROM item_additions ORDER BY added_date DESC LIMIT 5")
    const [removalsSample] = await db.promise().query("SELECT * FROM item_removals ORDER BY removed_date DESC LIMIT 5")

    res.json({
      tablesExist: {
        item_additions: additionsTable.length > 0,
        item_removals: removalsTable.length > 0,
      },
      structures: {
        item_additions: additionsStructure,
        item_removals: removalsStructure,
      },
      sampleData: {
        additions: additionsSample,
        removals: removalsSample,
      },
    })
  } catch (error) {
    console.error("❌ Error testing tables:", error)
    res.status(500).json({ error: "Failed to test tables", details: error.message })
  }
})

export default router
