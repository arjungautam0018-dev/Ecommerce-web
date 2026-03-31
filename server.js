const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const cookieParser = require("cookie-parser");

//Middleware
app.use(express.static("public"));
app.use(express.json()); // ✅ parse JSON body
app.use(express.urlencoded({ extended: true })); // ✅ parse form data if sent
app.use(cookieParser());

//Connect to database
const {connectDb_submit} = require("./db/db");
connectDb_submit();

//Session Setup

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false, 
    cookie: {
      httpOnly: true, // prevents browser From accessing cookie
      secure: false, 
      maxAge: 1000 * 60 * 60, //Limit of 1 hour
      sameSite: "strict",
    },
  })
);


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
});

//Serve login page
app.get("/login", (req,res)=>{
    res.sendFile(__dirname+"/public/html/login.html")
});

//Serve signup member
app.get("/signup", (req,res)=>{
    res.sendFile(__dirname+"/public/html/signup.html")
});

//Serve registration route
const registerRoute = require("./routes/register.routes");
app.use("/api", registerRoute);

//Serve login route
const loginRoute = require("./routes/login.routes");
app.use("/api", loginRoute);

//Serve cart route
const cartRoute = require("./routes/cart.routes");
app.use("/api", cartRoute);

//Serve contact route
const contactRoute = require("./routes/contact.routes");
app.use("/api", contactRoute);

//Start Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
