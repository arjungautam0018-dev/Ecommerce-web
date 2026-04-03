const express = require("express");
const router = express.Router();

const { sendWhatsAppMessage } = require("../services/whatsapp");

router.post("/send-whatsapp", async (req, res) => {
  const { phone, date, time } = req.body;

  try {
    const result = await sendWhatsAppMessage(phone, date, time);

    res.json({
      success: true,
      messageSid: result.sid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;