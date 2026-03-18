const express = require("express");
const app = express();

//Middleware
app.use(express.static("public"));

//Serve HTML file

//Serve home page
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/public/html/index.html");
})
//Serve cart
app.get("/serve/cart", (req,res)=>{
    res.sendFile(__dirname+"/public/html/cart.html");
})
//Start Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
