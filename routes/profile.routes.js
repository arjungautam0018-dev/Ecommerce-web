const express          = require("express");
const router           = express.Router();
const bcrypt           = require("bcrypt");
const User             = require("../models/register.models");
const Cart             = require("../models/cart.models");
const DeliveryAddress  = require("../models/delivery_address.models");
const Wishlist         = require("../models/wishlist.models");
const { isAuthenticated } = require("../middlewares/auth.middleware");


/* ─── normalize: DB doc → flat frontend shape ─────────── */
function normalizeProfile(user) {
    const base = { role: user.role, createdAt: user.createdAt };

    if (user.role === "studio") {
        return { ...base,
            fullName: user.studio_name     || "",
            email:    user.studio_email    || "",
            phone:    user.studio_phone    || "",
            pan:      user.studio_pan      || "",
            location: user.studio_location || "",
        };
    }
    if (user.role === "freelancer") {
        return { ...base,
            fullName: user.free_name     || "",
            email:    user.free_email    || "",
            phone:    user.free_phone    || "",
            pan:      user.free_pan      || "",
            location: user.free_location || "",
        };
    }
    // customer
    return { ...base,
        fullName: user.full_name     || "",
        email:    user.email_address || "",
        phone:    user.phone         || "",
    };
}


/* ─── denormalize: flat frontend shape → DB fields ────── */
function denormalizeProfile(role, data) {
    if (role === "studio") {
        return {
            studio_name:     data.fullName || "",
            studio_email:    data.email    || "",
            studio_phone:    data.phone    || "",
            studio_pan:      data.pan      || "",
            studio_location: data.location || "",
            email_address:   data.email    || "",
        };
    }
    if (role === "freelancer") {
        return {
            free_name:     data.fullName || "",
            free_email:    data.email    || "",
            free_phone:    data.phone    || "",
            free_pan:      data.pan      || "",
            free_location: data.location || "",
            email_address: data.email    || "",
        };
    }
    // customer
    return {
        full_name:     data.fullName || "",
        email_address: data.email    || "",
        phone:         data.phone    || "",
    };
}


/* ─── GET /api/profile ────────────────────────────────── */
router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .select("-password -studio_password -free_password");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json(normalizeProfile(user));
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ─── PUT /api/profile ────────────────────────────────── */
router.put("/profile", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        const updates = denormalizeProfile(user.role, req.body);
        await User.findByIdAndUpdate(req.session.userId, { $set: updates });
        return res.json({ message: "Profile updated" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ─── POST /api/profile/switch-role ───────────────────────
   Flow:
   1. Find current user by session ID
   2. Verify their current password (login-style check)
   3. Delete the old account document
   4. Create a brand new document with the new role + new password
   5. Update session to the new document's _id
   ──────────────────────────────────────────────────────── */
router.post("/profile/switch-role", isAuthenticated, async (req, res) => {
    try {
        const { newRole, currentPassword, ...roleData } = req.body;

        // validate new role
        if (!["customer", "studio", "freelancer"].includes(newRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // find current user
        const currentUser = await User.findById(req.session.userId);
        if (!currentUser) return res.status(404).json({ message: "User not found" });

        // pick the correct password hash based on current role
        let currentHash;
        if (currentUser.role === "studio")     currentHash = currentUser.studio_password;
        else if (currentUser.role === "freelancer") currentHash = currentUser.free_password;
        else                                   currentHash = currentUser.password;

        if (!currentHash) {
            return res.status(400).json({ message: "No password set on current account" });
        }

        // verify current password — login-style check
        const valid = await bcrypt.compare(currentPassword, currentHash);
        if (!valid) {
            return res.status(401).json({ message: "Incorrect password. Please try again." });
        }

        // new role password is required
        if (!roleData.password) {
            return res.status(400).json({ message: "New account password is required" });
        }
        if (!roleData.email) {
            return res.status(400).json({ message: "Email is required for the new account" });
        }

        const hashedNewPassword = await bcrypt.hash(roleData.password, 10);

        // build new account document
        let newAccountData = { role: newRole, email_address: roleData.email };

        if (newRole === "studio") {
            newAccountData.studio_name     = roleData.fullName || "";
            newAccountData.studio_email    = roleData.email    || "";
            newAccountData.studio_phone    = roleData.phone    || "";
            newAccountData.studio_pan      = roleData.pan      || "";
            newAccountData.studio_location = roleData.location || "";
            newAccountData.studio_password = hashedNewPassword;
        } else if (newRole === "freelancer") {
            newAccountData.free_name     = roleData.fullName || "";
            newAccountData.free_email    = roleData.email    || "";
            newAccountData.free_phone    = roleData.phone    || "";
            newAccountData.free_pan      = roleData.pan      || "";
            newAccountData.free_location = roleData.location || "";
            newAccountData.free_password = hashedNewPassword;
        } else {
            // customer
            newAccountData.full_name = roleData.fullName || "";
            newAccountData.phone     = roleData.phone    || "";
            newAccountData.password  = hashedNewPassword;
        }

        // delete old account + all associated data
        await Promise.all([
            User.findByIdAndDelete(req.session.userId),
            Cart.deleteOne({ userId: req.session.userId }),
            DeliveryAddress.deleteOne({ userId: req.session.userId }),
            Wishlist.deleteOne({ userId: req.session.userId }),
        ]);

        // create new account
        const newUser = await User.create(newAccountData);

        // update session to new account's _id
        req.session.userId = newUser._id;

        return res.json({ message: "Account switched successfully", role: newRole });

    } catch (err) {
        // handle duplicate email
        if (err.code === 11000) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
