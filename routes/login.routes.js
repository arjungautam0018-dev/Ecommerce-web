const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/register.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth.middleware");
// Login route
router.post("/login", async (req, res) => {
  console.log("Login route hit");

  try {
    const { email_address, password } = req.body;
    console.log("Login data received:", req.body);
    if (!email_address || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // normalize input email
    const emailInput = email_address.toLowerCase().trim();

    // Find user in any role
    const user = await User.findOne({
      $or: [
        { email_address: emailInput },
        { studio_email: emailInput },
        { free_email: emailInput }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Determine which password field to use
    let passwordToCompare = null;

    if (user.password && emailInput === user.email_address.toLowerCase()) {
      passwordToCompare = user.password;
    } else if (user.studio_password && emailInput === user.studio_email.toLowerCase()) {
      passwordToCompare = user.studio_password;
    } else if (user.free_password && emailInput === user.free_email.toLowerCase()) {
      passwordToCompare = user.free_password;
    }

    // If no password found, fail
    if (!passwordToCompare) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password safely
    const isMatch = await bcrypt.compare(password, passwordToCompare);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User authenticated successfully");

    //Session logic

req.session.userId = user._id;
    console.log("Session created with ID:", req.session.userId);

 return res.json({
      type: "success",
      message: "Login successful! Redirecting to homepage...",
      redirect: "/",
      delay: 5000
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Destroy session on logout
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    return res.redirect("/login");
  });
});



module.exports = router;