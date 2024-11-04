const express = require("express");
const app = express();
const db = require("./db");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Change 'person' to 'Person' 


app.get("/", function(req, res) {
    res.send("Welcome to our Hotel");
});

const personRoutes=require("./routes/personRoutes");

app.use('/person',personRoutes);

const menuRoutes=require("./routes/menuRoutes");
app.use("/menu",menuRoutes);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

