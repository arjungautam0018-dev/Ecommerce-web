const express      = require("express");
const router       = express.Router();
const Order        = require("../models/order.models");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { sendWhatsApp }    = require("../services/whatsapp.services");

const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || "+9779847825916";


/* ════════════════════════════════════════════════════════════
   POST /api/orders/place
   Saves order to DB, sends WhatsApp to admin, returns orderId.
   ════════════════════════════════════════════════════════════ */
router.post("/orders/place", isAuthenticated, async (req, res) => {
    try {
        const { items, deliveryAddress, subtotal, tax, total, paymentMethod } = req.body;

        if (!items?.length)   return res.status(400).json({ message: "No items in order" });
        if (!paymentMethod)   return res.status(400).json({ message: "Payment method required" });
        if (!deliveryAddress) return res.status(400).json({ message: "Delivery address required" });

        const order = await Order.create({
            userId: req.session.userId,
            items,
            deliveryAddress,
            subtotal,
            tax,
            total,
            paymentMethod,
            orderStatus: "placed",
        });

        // ── WhatsApp: new order placed ─────────────────────
        try {
            const itemList = order.items.map(i => `  • ${i.title} x${i.quantity}`).join("\n");
            const addr     = order.deliveryAddress;
            const addrStr  = [addr.province, addr.district, addr.municipality, addr.ward, addr.addressDetails]
                              .filter(Boolean).join(", ");

            await sendWhatsApp(ADMIN_WHATSAPP,
                `📦 *New Order Placed!*\n` +
                `Order ID: *${order.orderId}*\n` +
                `Total: Rs.${total}\n` +
                `Payment: ${paymentMethod.toUpperCase()}\n` +
                `Items:\n${itemList}\n` +
                `Delivery: ${addrStr || "Not provided"}`
            );
            await Order.findByIdAndUpdate(order._id, { whatsappNotified: true });
        } catch (waErr) {
            // WhatsApp failure must not block the order
            console.error("[whatsapp/place]", waErr.message);
        }
        // ──────────────────────────────────────────────────

        return res.json({ message: "Order placed", orderId: order._id, humanOrderId: order.orderId });

    } catch (err) {
        console.error("[order/place]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ════════════════════════════════════════════════════════════
   GET /api/orders
   Returns all orders for the logged-in user.
   ════════════════════════════════════════════════════════════ */
router.get("/orders", isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.session.userId }).sort({ createdAt: -1 });
        return res.json({ orders });
    } catch (err) {
        console.error("[order/list]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ════════════════════════════════════════════════════════════
   GET /api/orders/:orderId
   Returns a single order by DB _id.
   ════════════════════════════════════════════════════════════ */
router.get("/orders/:orderId", isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id:    req.params.orderId,
            userId: req.session.userId,
        });
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.json({ order });
    } catch (err) {
        console.error("[order/get]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ════════════════════════════════════════════════════════════
   POST /api/orders/:orderId/confirm
   Called after user completes upload page.
   Marks order as processing, sends WhatsApp confirmation.
   ════════════════════════════════════════════════════════════ */
router.post("/orders/:orderId/confirm", isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id:    req.params.orderId,
            userId: req.session.userId,
        });
        if (!order) return res.status(404).json({ message: "Order not found" });

        const { note } = req.body;
        if (note) order.note = note;

        order.orderStatus = "processing";

        if (order.paymentMethod === "cod") {
            order.paymentStatus = "pending"; // paid on delivery
        }

        // ── eSewa payment verification ─────────────────────
        // TODO: After eSewa redirects back to your site with transaction data,
        // verify the payment server-side using eSewa's verification API:
        //
        // const { token, amount, product_code } = req.body;
        // const verifyRes = await fetch("https://uat.esewa.com.np/epay/transrec", {
        //   method: "POST",
        //   body: new URLSearchParams({ amt: amount, scd: product_code, rid: token, pid: orderId })
        // });
        // if (verifyRes.ok) {
        //   order.paymentStatus      = "paid";
        //   order.esewaTransactionId = token;
        // }
        // ──────────────────────────────────────────────────

        // ── Khalti payment verification ────────────────────
        // TODO: After Khalti redirects back, verify using Khalti lookup API:
        //
        // const { pidx } = req.body;
        // const verifyRes = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
        //   method: "POST",
        //   headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" },
        //   body: JSON.stringify({ pidx })
        // });
        // const data = await verifyRes.json();
        // if (data.status === "Completed") {
        //   order.paymentStatus = "paid";
        //   order.khaltiPidx    = pidx;
        // }
        // ──────────────────────────────────────────────────

        await order.save();

        // ── WhatsApp: order confirmed ──────────────────────
        try {
            await sendWhatsApp(ADMIN_WHATSAPP,
                `✅ *Order Confirmed!*\n` +
                `Order ID: *${order.orderId}*\n` +
                `Total: Rs.${order.total}\n` +
                `Payment: ${order.paymentMethod.toUpperCase()}\n` +
                `Status: Processing`
            );
        } catch (waErr) {
            console.error("[whatsapp/confirm]", waErr.message);
        }
        // ──────────────────────────────────────────────────

        return res.json({ message: "Order confirmed", order });

    } catch (err) {
        console.error("[order/confirm]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ════════════════════════════════════════════════════════════
   POST /api/orders/:orderId/cancel
   Called when user aborts at any step after placing the order.
   Marks order as cancelled, sends WhatsApp cancellation notice.
   ════════════════════════════════════════════════════════════ */
router.post("/orders/:orderId/cancel", isAuthenticated, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id:    req.params.orderId,
            userId: req.session.userId,
        });
        if (!order) return res.status(404).json({ message: "Order not found" });

        // idempotency — already cancelled, do not send WhatsApp again
        if (order.orderStatus === "cancelled") {
            return res.json({ message: "Order already cancelled" });
        }

        const { reason } = req.body;

        order.orderStatus   = "cancelled";
        order.paymentStatus = "failed";
        order.cancelledAt   = new Date(); // triggers TTL — deleted from DB after 24h
        if (reason) order.note = `Cancelled: ${reason}`;

        await order.save();

        // ── WhatsApp: order cancelled ──────────────────────
        try {
            const itemList = order.items.map(i => `  • ${i.title} x${i.quantity}`).join("\n");
            await sendWhatsApp(ADMIN_WHATSAPP,
                `❌ *Order Cancelled*\n` +
                `Order ID: *${order.orderId}*\n` +
                `Total: Rs.${order.total}\n` +
                `Payment: ${order.paymentMethod.toUpperCase()}\n` +
                `Reason: ${reason || "User aborted process"}\n` +
                `Items:\n${itemList}`
            );
            await Order.findByIdAndUpdate(order._id, { whatsappCancelNotified: true });
        } catch (waErr) {
            console.error("[whatsapp/cancel]", waErr.message);
        }
        // ──────────────────────────────────────────────────

        return res.json({ message: "Order cancelled" });

    } catch (err) {
        console.error("[order/cancel]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


/* ════════════════════════════════════════════════════════════
   POST /api/orders/:orderId/upload-designs
   Receives multipart/form-data with field "designs" (multiple images).
   Uploads each to Cloudflare Images and saves URLs to the order.

   CLOUDFLARE IMAGES INTEGRATION:
   ─────────────────────────────────────────────────────────
   TODO: Install multer + set up Cloudflare Images upload.

   1. npm install multer
   2. Set env vars:
      CLOUDFLARE_ACCOUNT_ID=your_account_id
      CLOUDFLARE_IMAGES_TOKEN=your_api_token

   3. Replace the placeholder below with:

   const multer  = require("multer");
   const upload  = multer({ storage: multer.memoryStorage() });
   const fetch   = require("node-fetch"); // or use native fetch (Node 18+)
   const FormData = require("form-data");

   router.post("/orders/:orderId/upload-designs",
     isAuthenticated,
     upload.array("designs", 20),  // max 20 photos
     async (req, res) => {
       const order = await Order.findOne({ _id: req.params.orderId, userId: req.session.userId });
       if (!order) return res.status(404).json({ message: "Order not found" });

       const uploadedUrls = [];

       for (const file of req.files) {
         const fd = new FormData();
         fd.append("file", file.buffer, { filename: file.originalname, contentType: file.mimetype });

         const cfRes = await fetch(
           `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
           {
             method: "POST",
             headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_TOKEN}` },
             body: fd,
           }
         );
         const cfData = await cfRes.json();
         if (cfData.success) {
           uploadedUrls.push(cfData.result.variants[0]); // public URL
         }
       }

       order.designImages = uploadedUrls;
       await order.save();

       return res.json({ message: "Designs uploaded", urls: uploadedUrls });
     }
   );
   ─────────────────────────────────────────────────────────
   ════════════════════════════════════════════════════════════ */
router.post("/orders/:orderId/upload-designs", isAuthenticated, async (req, res) => {
    // PLACEHOLDER — returns success without actually uploading
    // Replace this entire handler with the Cloudflare implementation above
    try {
        const order = await Order.findOne({ _id: req.params.orderId, userId: req.session.userId });
        if (!order) return res.status(404).json({ message: "Order not found" });
        // TODO: process req.files after adding multer middleware
        return res.json({ message: "Upload received (Cloudflare integration pending)", urls: [] });
    } catch (err) {
        console.error("[order/upload-designs]", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});


   router.post("/orders/:orderId/pay/esewa", isAuthenticated, async (req, res) => {
       const order = await Order.findById(req.params.orderId);
       const params = {
           amt: order.total, psc: 0, pdc: 0, txAmt: 0, tAmt: order.total,
           pid: order._id.toString(),
           scd: process.env.ESEWA_MERCHANT_CODE,
           su:  `${process.env.BASE_URL}/api/orders/${order._id}/esewa/success`,
           fu:  `${process.env.BASE_URL}/api/orders/${order._id}/esewa/failure`,
       };
       return res.json({ esewaUrl: "https://uat.esewa.com.np/epay/main", params });
   });


/* ════════════════════════════════════════════════════════════
   Khalti INTEGRATION PLACEHOLDER
   ════════════════════════════════════════════════════════════
   TODO: Add Khalti initiate payment route here.
   Docs: https://docs.khalti.com/

   router.post("/orders/:orderId/pay/khalti", isAuthenticated, async (req, res) => {
       const order = await Order.findById(req.params.orderId);
       const initRes = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
           method: "POST",
           headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`, "Content-Type": "application/json" },
           body: JSON.stringify({
               return_url: `${process.env.BASE_URL}/api/orders/${order._id}/khalti/callback`,
               website_url: process.env.BASE_URL,
               amount: order.total * 100,
               purchase_order_id: order._id.toString(),
               purchase_order_name: "ShopHub Order",
           })
       });
       const data = await initRes.json();
       return res.json({ paymentUrl: data.payment_url });
   });
   ════════════════════════════════════════════════════════════ */


module.exports = router;
