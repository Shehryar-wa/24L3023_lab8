const express = require("express"); 
const cors = require("cors"); 
const { connectDB } = require("./config/db"); 
const userRoutes = require("./route/userroutes"); 

const app = express();
app.use(cors()); 
app.use(express.json()); 

connectDB();

app.use("/lab8", userRoutes); 

app.get("/", (req, res) => { 
    res.send("Server running 🚀"); 
}); 

app.listen(5000, () => { 
    console.log("Server running on port 5000");
 });