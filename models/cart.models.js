const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      productId:   { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      title:       { type: String, required: true },
      description: { type: String },
      price:       { type: Number, required: true },
      img:         { type: String },
      quantity:    { type: Number, default: 1 },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model("Cart", CartSchema);