const express= require("express");
const router = express.Router();
const DeliveryAddress = require("../models/delivery_address.models");
const { isAuthenticated } = require("../middlewares/auth.middleware");

// Create a new delivery address
router.post("/address/save", isAuthenticated, async (req, res) => {
    console.log("Create delivery adress route hit for user:", req.session.userId);
    try {
        const { province, district, municipality, ward, addressDetails } = req.body;
        await DeliveryAddress.findOneAndUpdate(
            { userId: req.session.userId }, //Find the delivery adress for the user from the db
            { province, district, municipality, ward, addressDetails },
            { new: true, upsert: true }
        );
        return res.status(200).json({ message: "Delivery address saved successfully" });

    } catch (error) {
        console.error("Error creating delivery address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/address/fetch", isAuthenticated, async(req,res)=>{
    try {
        const deliveryAddress = await DeliveryAddress.findOne({ userId: req.session.userId });
        return res.status(200).json({ deliveryAddress });
    } catch (error) {
        console.error("Error fetching delivery address:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
module.exports = router;