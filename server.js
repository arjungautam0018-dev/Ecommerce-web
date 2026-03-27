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
//Serve Profile
app.get("/serve/profile", (req,res)=>{
    res.sendFile(__dirname+"/public/html/profile.html")
})
//Serve Wishlist
app.get("/serve/wishlist", (req,res)=>{
    res.sendFile(__dirname+"/public/html/wishlist.html")
})
//Serve Contact
app.get("/serve/contact", (req,res)=>{
    res.sendFile(__dirname+"/public/html/contact.html")
})
//Serve Categories
app.get("/serve/category/sports", (req,res)=>{
    res.sendFile(__dirname+"/public/html/category-sports.html")
})
// Old URL → new Sports category
app.get("/serve/category/gifts", (req,res)=>{
    res.redirect(301, "/serve/category/sports");
})
app.get("/serve/category/events", (req,res)=>{
    res.sendFile(__dirname+"/public/html/category-events.html")
})
app.get("/serve/category/office", (req,res)=>{
    res.sendFile(__dirname+"/public/html/category-office.html")
})
app.get("/serve/category/custom", (req,res)=>{
    res.sendFile(__dirname+"/public/html/category-custom.html")
})

//Serve payment successful
app.get("/success", (req,res)=>{
    res.sendFile(__dirname+"/public/html/payment_success.html")
});

//Serve order tracking
app.get("/orders", (req,res)=>{
    res.sendFile(__dirname+"/public/html/orders.html"
    )
});

//Serve Nepal Details
app.get("/api/nepal-data", (req,res)=>{
    res.sendFile(__dirname+"/public/resources/nepal-address.json")
})
//Start Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
