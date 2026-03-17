const express = require("express");
const app = express();

//Middleware
app.use(express.static("public"));

//Serve HTML file
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/public/html/index.html");
})

//Start Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
