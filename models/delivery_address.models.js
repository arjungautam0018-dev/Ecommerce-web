const mongoose = require("mongoose");

const deliveryAddressSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    province:{
        type: String,
        required: true,
    },
    district:{
        type: String,
        required: true,
    },
    municipality:{
        type: String,
        required: true,
    },
    ward:{
        type: String,
        required: true,
    },
    addressDetails:{
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("DeliveryAddress", deliveryAddressSchema);
