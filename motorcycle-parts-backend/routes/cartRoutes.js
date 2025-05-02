import express from "express";
import db from "../config/db.js"; // Ensure db.js uses ES Modules

const router = express.Router();

// Get all cart items
router.get("/items", async (req, res) => {
    try {
        const [items] = await db.execute("SELECT * FROM cart");
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// Add item to cart
router.post("/add", async (req, res) => {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        await db.execute("INSERT INTO cart (product_id, quantity) VALUES (?, ?)", [product_id, quantity]);
        res.status(201).json({ message: "Item added to cart" });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

// Delete item from cart
router.delete("/remove/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("DELETE FROM cart WHERE id = ?", [id]);
        res.json({ message: "Item removed from cart" });
    } catch (error) {
        res.status(500).json({ error: "Database error" });
    }
});

export default router; // ✅ Use export default
