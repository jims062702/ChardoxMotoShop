import express from "express"
import multer from "multer"
import { db } from "../server.js"

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const upload = multer({ storage })

router.post("/add", upload.single("image"), (req, res) => {
  console.log("📡 Received request to add item:", req.body)
  console.log("📷 Uploaded Image:", req.file)

  const { name, price, description, stock, category } = req.body
  const image = req.file ? req.file.filename : null

  if (!name || !price || !description || !stock || !image) {
    return res.status(400).json({ error: "All fields are required." })
  }

  const query = "INSERT INTO parts (name, price, description, stock, image, category) VALUES (?, ?, ?, ?, ?, ?)"
  db.query(query, [name, price, description, stock, image, category || ""], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err)
      return res.status(500).json({ error: "Failed to add new part." })
    }

    // The trigger will automatically record this addition in item_additions table
    res.status(201).json({ message: "Part added successfully!", partId: result.insertId })
  })
})

router.put("/update/:id", upload.single("image"), (req, res) => {
  const { id } = req.params
  const { name, price, description, category } = req.body
  const image = req.file ? req.file.filename : null

  if (!name || !price || !description) {
    return res.status(400).json({ error: "All fields except image are required." })
  }

  const query = image
    ? "UPDATE parts SET name = ?, price = ?, description = ?, image = ?, category = ? WHERE id = ?"
    : "UPDATE parts SET name = ?, price = ?, description = ?, category = ? WHERE id = ?"

  const values = image
    ? [name, price, description, image, category || "", id]
    : [name, price, description, category || "", id]

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err)
      return res.status(500).json({ error: "Failed to update part." })
    }
    res.json({ message: "Part updated successfully!" })
  })
})

router.put("/updatePrice/:id", async (req, res) => {
  const { id } = req.params
  const { newPrice } = req.body

  try {
    // Get the current price
    const [current] = await db.promise().query("SELECT price FROM parts WHERE id = ?", [id])

    if (current.length > 0) {
      const oldPrice = current[0].price

      // Save price change in history
      await db
        .promise()
        .query("INSERT INTO price_history (part_id, old_price, new_price) VALUES (?, ?, ?)", [id, oldPrice, newPrice])

      // Update the price in parts table
      await db.promise().query("UPDATE parts SET price = ? WHERE id = ?", [newPrice, id])

      res.json({ message: "Price updated successfully!" })
    } else {
      res.status(404).json({ error: "Item not found!" })
    }
  } catch (error) {
    console.error("❌ Database Error:", error)
    res.status(500).json({ error: "Database error!" })
  }
})

router.get("/priceHistory/:id", async (req, res) => {
  const { id } = req.params

  try {
    const [history] = await db
      .promise()
      .query(
        "SELECT old_price, new_price, change_date FROM price_history WHERE part_id = ? ORDER BY change_date DESC",
        [id],
      )

    res.json(history)
  } catch (error) {
    console.error("❌ Database Error:", error)
    res.status(500).json({ error: "Database error!" })
  }
})

router.put("/update-stock/:id", async (req, res) => {
  console.log("🟢 Stock Update Route Hit:", req.params.id, req.body)

  const { id } = req.params
  let { amount, operation } = req.body

  if (!id || !amount || !operation) {
    return res.status(400).json({ message: "Invalid request parameters" })
  }

  amount = Number.parseInt(amount)

  try {
    // Get current part information
    const [currentPart] = await db.promise().query("SELECT * FROM parts WHERE id = ?", [id])

    if (currentPart.length === 0) {
      return res.status(404).json({ message: "Part not found" })
    }

    const part = currentPart[0]
    const currentStock = Number.parseInt(part.stock)
    let newStock = operation === "increase" ? currentStock + amount : currentStock - amount

    if (newStock < 0) newStock = 0

    console.log("Updating stock:", { id, currentStock, amount, operation, newStock })

    // Update the stock (this will trigger the automatic tracking via database trigger)
    const [updateResult] = await db.promise().query("UPDATE parts SET stock = ? WHERE id = ?", [newStock, id])

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "Stock update failed, no rows affected." })
    }

    console.log("✅ Stock updated:", updateResult)
    res.json({ message: `Stock ${operation}d successfully!`, newStock })
  } catch (error) {
    console.error("❌ Database Error:", error)
    res.status(500).json({ message: "Failed to update stock" })
  }
})

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params

  try {
    // First check if the part exists and get its information
    const [partResults] = await db.promise().query("SELECT * FROM parts WHERE id = ?", [id])

    if (partResults.length === 0) {
      return res.status(404).json({ error: "Part not found" })
    }

    const part = partResults[0]

    // Start a transaction to ensure all operations succeed or fail together
    await db.promise().query("START TRANSACTION")

    try {
      // Record the removal in item_removals table
      await db.promise().query(
        `
        INSERT INTO item_removals (
          product_id, product_name, category, quantity, 
          unit_price, total_value, removed_by, reason, image
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          part.id,
          part.name,
          part.category || "Uncategorized",
          part.stock,
          part.price,
          part.stock * part.price,
          "Admin",
          "Item deleted from inventory",
          part.image,
        ],
      )

      // Delete all price history records for this part
      console.log("Deleting price history for part:", id)
      await db.promise().query("DELETE FROM price_history WHERE part_id = ?", [id])

      // Now delete the part itself
      console.log("Deleting part:", id)
      const [deleteResult] = await db.promise().query("DELETE FROM parts WHERE id = ?", [id])

      // If we got here, everything succeeded, so commit the transaction
      await db.promise().query("COMMIT")

      res.json({
        message: "Part deleted successfully and removal recorded!",
        affectedRows: deleteResult.affectedRows,
      })
    } catch (error) {
      // If anything failed, roll back the transaction
      await db.promise().query("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Error deleting part:", error)

    // Check if this is a foreign key constraint error
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        error: "Cannot delete part",
        message: "This part is referenced in other records and cannot be deleted. Details: " + error.sqlMessage,
        code: error.code,
      })
    }

    return res.status(500).json({
      error: "Database error",
      message: error.message || "Unknown error occurred",
      code: error.code,
    })
  }
})

router.get("/get-parts", (req, res) => {
  db.query("SELECT * FROM parts", (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err)
      return res.status(500).json({ error: "Database error" })
    }
    res.json(results)
  })
})

router.get("/get-categories", (req, res) => {
  db.query("SELECT DISTINCT category FROM parts WHERE category != '' ORDER BY category", (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err)
      return res.status(500).json({ error: "Database error" })
    }
    res.json(results)
  })
})

router.post("/add-category", (req, res) => {
  const { category } = req.body

  if (!category) {
    return res.status(400).json({ error: "Category name is required." })
  }

  db.query("SELECT * FROM parts WHERE category = ? LIMIT 1", [category], (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err)
      return res.status(500).json({ error: "Database error" })
    }

    res.status(201).json({ message: "Category added successfully!" })
  })
})

export default router
