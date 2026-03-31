const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name:{
        required:true,
        type:String
    },
    email:{
        required:true,
        type:String
    
    },
    subject:{
        required:true,
        type:String
    },
    
    message:{
        required:true,
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});
module.exports = mongoose.model("Contact",contactSchema);
