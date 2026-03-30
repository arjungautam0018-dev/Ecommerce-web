const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  full_name: String,

  email_address: {
    type: String,
        unique: true
  },

  password: {
    type: String,
  },

  role: {
    type: String,
    enum: ["customer", "studio", "freelancer"],
    default: "customer"
  },

  phone: String,

  // STUDIO
  studio_name: String,
  studio_email: String,
  studio_phone: String,
  studio_pan: String,
  studio_location: String,
  studio_password : String,

  // FREELANCER
  free_name: String,
  free_email: String,
  free_phone: String,
  free_pan: String,
  free_location: String,
  free_password : String,

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);