const twilio = require("twilio");

async function sendWhatsApp(to, body) {
    console.log("[WhatsApp] sendWhatsApp called — to:", to);

    const sid   = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;

    if (!sid || !token) {
        console.error("[WhatsApp] MISSING env vars — TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN not set");
        return;
    }
    if (!to) {
        console.error("[WhatsApp] No recipient number — ADMIN_WHATSAPP not set in env");
        return;
    }

    try {
        const client  = twilio(sid, token);
        const message = await client.messages.create({
            from: "whatsapp:+14155238886",
            to:   `whatsapp:${to}`,
            body,
        });
        console.log("[WhatsApp] sent successfully — SID:", message.sid);
        return message;
    } catch (err) {
        console.error("[WhatsApp] Twilio error:", err.message);
        throw err;
    }
}

module.exports = { sendWhatsApp };
