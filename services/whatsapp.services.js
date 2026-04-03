const twilio = require("twilio");

// Sandbox credentials — hardcoded for testing
const accountSid = "REMOVED";
const authToken  = "REMOVED";  // replace with what Twilio gave you
const client     = twilio(accountSid, authToken);

async function sendWhatsApp(to, body) {
  try {
    const message = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio sandbox number
      to: `whatsapp:${to}`,           // your phone number joined in sandbox
      body
    });
    console.log("WhatsApp message sent:", message.sid);
    return message;
  } catch (err) {
    console.error("Error sending WhatsApp message:", err);
    throw err;
  }
}

module.exports = { sendWhatsApp };