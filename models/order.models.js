const mongoose = require("mongoose");

// Generate human-readable order ID: ORD-XXXXXXXX
function generateOrderId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "ORD-";
    for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

const orderSchema = new mongoose.Schema({

    orderId: {
        type:    String,
        unique:  true,
        default: generateOrderId,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    items: [
        {
            title:       { type: String, required: true },
            price:       { type: Number, required: true },
            img:         { type: String },
            description: { type: String },
            quantity:    { type: Number, default: 1 },
        }
    ],

    deliveryAddress: {
        province:       String,
        district:       String,
        municipality:   String,
        ward:           String,
        addressDetails: String,
    },

    subtotal:  { type: Number, required: true },
    tax:       { type: Number, required: true },
    total:     { type: Number, required: true },

    paymentMethod: {
        type: String,
        enum: ["esewa", "khalti", "ime", "connectips", "cod"],
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },

    orderStatus: {
        type: String,
        enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
        default: "placed",
    },

    note: { type: String },

    // design photos uploaded by user (Cloudflare Images URLs)
    designImages: [{ type: String }],

    // ── eSewa integration ──────────────────────────────────
    // TODO: store eSewa transaction UUID and ref ID here after payment callback
    esewaTransactionId: { type: String },
    esewaRefId:         { type: String },

    // ── Khalti integration ─────────────────────────────────
    // TODO: store Khalti pidx and token here after payment callback
    khaltiPidx:  { type: String },
    khaltiToken: { type: String },

    // ── WhatsApp notification ──────────────────────────────
    // TODO: set to true after WhatsApp notification is sent via Twilio/WATI/etc.
    whatsappNotified:        { type: Boolean, default: false },
    whatsappCancelNotified:  { type: Boolean, default: false },

    // ── Auto-delete cancelled orders after 24 hours ────────
    // MongoDB TTL index watches this field.
    // Set to a date when order is cancelled; MongoDB deletes the doc 24h later.
    // For non-cancelled orders this stays null and TTL never fires.
    cancelledAt: { type: Date, default: null },

}, { timestamps: true });

// TTL index — deletes document 86400 seconds (24h) after cancelledAt is set
orderSchema.index({ cancelledAt: 1 }, { expireAfterSeconds: 86400, partialFilterExpression: { cancelledAt: { $type: "date" } } });

module.exports = mongoose.model("Order", orderSchema);
