const express = require("express");
const router = express.Router();
const User = require("../models/register.models");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  console.log("Register API hit");
  console.log(req.body);

  try {
const role = (req.body.role || "").toLowerCase();
    let finalData = { role };

    // 🔥 ROLE BASED LOGIC
    if (role === "customer") {
      const { full_name, email_address, phone, password } = req.body;

      if (!email_address || !password) {
        return res.status(400).json({ message: "Customer email and password required" });
      }

      finalData.full_name = full_name;
      finalData.email_address = email_address;
      finalData.phone = phone;
      finalData.password = await bcrypt.hash(password.toString(), 10); // ✅ safe hashing

    } else if (role === "studio") {
      const { studio_name, studio_email, studio_phone, studio_pan, studio_location, studio_password } = req.body;

      if (!studio_email || !studio_password) {
        return res.status(400).json({ message: "Studio email and password required" });
      }

      finalData.studio_name = studio_name;
      finalData.studio_email = studio_email;
      finalData.studio_phone = studio_phone;
      finalData.studio_pan = studio_pan;
      finalData.studio_location = studio_location;
      finalData.email_address = studio_email; // for unique check
finalData.studio_password = await bcrypt.hash(studio_password, 10);
    } else if (role === "freelancer") {
      const { free_name, free_email, free_phone, free_pan, free_location, free_password } = req.body;

      if (!free_email || !free_password) {
        return res.status(400).json({ message: "Freelancer email and password required" });
      }

      finalData.free_name = free_name;
      finalData.free_email = free_email;
      finalData.free_phone = free_phone;
      finalData.free_pan = free_pan;
      finalData.free_location = free_location;
      finalData.free_password = await bcrypt.hash(free_password.toString(), 10); // ✅ hashed here
      finalData.email_address = free_email; // for unique check
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await User.findOne({ email_address: finalData.email_address });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ SAVE
    const newUser = new User(finalData);
    await newUser.save();
    return res.json({
      type: "success",
      message: "Registered successfully! Redirecting to login...",
      redirect: "/login",
      delay: 5000 // 5 seconds delay
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;