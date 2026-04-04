const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "superadmin"],
    default: "admin",
  }
});

// Pre-save hook to hash password automatically
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // only hash if password changed

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Method to compare password during login
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);