const mongoose = require("mongoose");


const connectDb_submit = async () => {
    try {
        await mongoose.connect(
            process.env.atlas_url,

        );
        console.log("Mongoose for submission connected successfully")
    } catch (error) {
        console.error("MongoDB connection failed for submission:", error);
    }
}


module.exports = { connectDb_submit };