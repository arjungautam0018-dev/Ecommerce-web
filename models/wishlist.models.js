const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    items: [
        {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            img:   { type: String },
            desc:  { type: String },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
