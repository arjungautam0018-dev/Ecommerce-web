const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsApp(to, body) {
    try {
        const message = await client.messages.create({
            from: "whatsapp:+14155238886", // Twilio sandbox number
            to:   `whatsapp:${to}`,
            body,
        });
        console.log("[WhatsApp] sent:", message.sid);
        return message;
    } catch (err) {
        console.error("[WhatsApp] error:", err.message);
        throw err;
    }
}

module.exports = { sendWhatsApp };
