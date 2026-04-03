const rateLimit = require("express-rate-limit");

/* ── Login / Register — brute force protection ── */
const authLimiter = rateLimit({
    windowMs:         15 * 60 * 1000, // 15 minutes
    max:              10,              // 10 attempts per window
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { message: "Too many attempts. Please try again in 15 minutes." },
});

/* ── Password-sensitive actions (role switch, profile update) ── */
const sensitiveActionLimiter = rateLimit({
    windowMs:         15 * 60 * 1000,
    max:              20,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { message: "Too many requests. Please slow down." },
});

/* ── Order placement ── */
const orderLimiter = rateLimit({
    windowMs:         60 * 60 * 1000, // 1 hour
    max:              30,              // 30 orders per hour
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { message: "Too many orders placed. Please try again later." },
});

/* ── File upload ── */
const uploadLimiter = rateLimit({
    windowMs:         60 * 60 * 1000,
    max:              50,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { message: "Too many uploads. Please try again later." },
});

/* ── General API (cart, wishlist, profile reads) ── */
const generalLimiter = rateLimit({
    windowMs:         10 * 60 * 1000, // 10 minutes
    max:              200,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { message: "Too many requests. Please slow down." },
});

/* ── Contact form ── */
const contactLimiter = rateLimit({
    windowMs:         60 * 60 * 1000,
    max:              10,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: { message: "Too many messages sent. Please try again in an hour." },
});

module.exports = {
    authLimiter,
    sensitiveActionLimiter,
    orderLimiter,
    uploadLimiter,
    generalLimiter,
    contactLimiter,
};
