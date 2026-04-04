const express  = require('express');
const router   = express.Router();
const Contact  = require('../models/contact.models');
const nodemailer = require("nodemailer");

function isAdmin(req, res, next) {
    if (req.session.adminId) return next();
    return res.status(401).json({ message: "Admin access required" });
}

// POST /api/contact — save message + email admin
router.post("/contact", async (req, res) => {
    console.log("Contact form route hit");
    try {
        const { name, email, subject, message } = req.body;
        const contact = new Contact({ name, email, subject, message });
        await contact.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });

        await transporter.sendMail({
            from:    `"ShopHub Contact" <${process.env.EMAIL_USER}>`,
            to:      "arjungautam0018@gmail.com",
            subject: `New Contact: ${subject}`,
            html:    `<h3>New Message</h3><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br>${message}</p>`
        });

        res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error saving contact message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
});

// GET /api/admin/contacts — all contact messages (admin only)
router.get("/admin/contacts", isAdmin, async (req, res) => {
    console.log("Admin contacts route hit");
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        return res.json({ contacts });
    } catch (err) {
        console.error("[admin/contacts]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;