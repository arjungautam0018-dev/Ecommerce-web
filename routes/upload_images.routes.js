const express = require("express");
const router = express.Router();
const {uploadLimiter} = require("../middlewares/ratelimit.middleware");
const r2 = require("../config/r2.config");
const multer = require("multer");
const upload = multer();
const { PutObjectCommand } = require("@aws-sdk/client-s3");

//Route to handle image uploads
router.post("/upload",uploadLimiter, upload.array("files", 100), async (req, res) => {
  try {
    const files = req.files;

    const uploadPromises = files.map(async (file) => {
      const fileName = Date.now() + "-" + file.originalname;

      const command = new PutObjectCommand({
        Bucket: process.env.bucket_name,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await r2.send(command);

      return `https://${process.env.bucket_name}.<account-id>.r2.dev/${fileName}`;
    });

    const urls = await Promise.all(uploadPromises);

    res.json({ urls });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});