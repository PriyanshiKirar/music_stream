
require("dotenv").config();
const express=require("express");
const app=express();
const path=require("path");
const cookieParser=require("cookie-parser");
const userRoutes=require("./routes/user.routes")
const musicRoutes=require("./routes/music.routes")

const connectToDb=require("./config/mongodb")
connectToDb();
app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(cookieParser());


app.use("/user",userRoutes)
 
app.use("/music",musicRoutes) 

app.listen(process.env.PORT || 3000);