const { S3Client } = require("@aws-sdk/client-s3");

const r2 = new S3Client({
    region:   "auto",
    endpoint: process.env.ENDPOINTS_URL,
    credentials: {
        accessKeyId:     process.env.Access_Key_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
});

module.exports = r2;
