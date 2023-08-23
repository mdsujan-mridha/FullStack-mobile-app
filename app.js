const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express();



// middleware

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// config with  dotenv
dotenv.config({ path: "./config/config.env" });

const user = require("./routes/userRoute");

app.use("/api/v1", user);


module.exports = app;