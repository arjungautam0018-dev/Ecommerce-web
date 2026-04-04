require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/admin.models");

async function createAdmin() {
  try {
    // ✅ Connect to Atlas without options
    await mongoose.connect(process.env.atlas_url);
    console.log("Connected to MongoDB Atlas");

    const admin = new Admin({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: "superadmin",
    });

    await admin.save();
    console.log("Admin created and password hashed ✅");

    await mongoose.connection.close();
  } catch (err) {
    console.error("Error creating admin:", err);
    mongoose.connection.close();
  }
}

createAdmin();