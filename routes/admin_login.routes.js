const express = require("express");
const router  = express.Router();
const Admin   = require("../models/admin.models");
const { authLimiter } = require("../middlewares/ratelimit.middleware");

// POST /api/admin/login
router.post("/admin/login", authLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(401).json({ message: "Invalid username or password" });

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid username or password" });

        // set admin session
        req.session.adminId   = admin._id;
        req.session.adminRole = admin.role;

        return res.json({ message: "Login successful", role: admin.role });

    } catch (err) {
        console.error("[admin/login]", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// POST /api/admin/logout
router.post("/admin/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out" });
    });
});

module.exports = router;
