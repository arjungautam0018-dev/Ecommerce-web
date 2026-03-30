const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const Cart = require('../models/cart.models');

function parsePrice(priceText) {
  return Number(String(priceText).replace(/[^0-9]/g, "")) || 0;
}

// POST /api/cart/add
router.post("/cart/add", authMiddleware.isAuthenticated, async (req, res) => {
    try {
        console.log("Cart route hit");
        console.log("req.body:", req.body); // will now show all fields

        const userId = req.session.userId;

        // Frontend sends individual fields — NOT an "items" array
        const { title, price, img, desc, quantity = 1, redirect } = req.body;

        if (!title || price === undefined) {
            return res.status(400).json({ message: "title and price are required" });
        }

        const incomingItem = {
            title,
            price:       parsePrice(price),   // "रू.2,499" → 2499
            img,
            description: desc,
            quantity:    Number(quantity) || 1,
        };

        console.log("Parsed item:", incomingItem);

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const existingIndex = cart.items.findIndex(
                (item) => item.title === title
            );

            if (existingIndex > -1) {
                // Item already in cart — bump quantity
                cart.items[existingIndex].quantity += incomingItem.quantity;
            } else {
                cart.items.push(incomingItem);
            }
        } else {
            cart = new Cart({ userId, items: [incomingItem] });
        }

        await cart.save();
        console.log("Cart saved:", cart);

        // HTML form submission — respond with redirect not JSON
        if (redirect === "true") {
            return res.redirect("/serve/cart");
        }

        // fetch() / JS submission — respond with JSON
        return res.json({ message: "Cart updated successfully", cart });

    } catch (error) {
        console.error("Error updating cart:", error);

        if (req.body.redirect === "true") {
            return res.redirect("back");
        }

        return res.status(500).json({ message: "Internal server error" });
    }
});

//Fetch cart items for the logged-in user
router.get("/cart", authMiddleware.isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const cart = await Cart.findOne({ userId }).populate("items");
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        return res.json({ cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = router;