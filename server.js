const express = require("express");
const app = express();
const db = require("./db");
const passport=require('./auth');
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(passport.initialize());
//MIDDLEWARE FUNCTION
const logRequest=(req,res,next)=>{
    console.log(`${new Date().toLocaleString()} Request made to:${req.originalUrl}`);
    next();
}
app.use(logRequest);

const localAuthMiddleware=passport.authenticate('local',{session:false});
app.get("/",function(req, res) {
    res.send("Welcome to our Hotel");
});

const personRoutes=require("./routes/personRoutes");

app.use('/person',personRoutes);

const menuRoutes=require("./routes/menuRoutes");
const req = require("express/lib/request");
app.use("/menu",menuRoutes);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

