const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const errorMiddleware = require("./middleware/error");
const app = express();



// middleware
const corsOptions = {
    origin:'*',
    'Content-Type': 'Authorization',
    "Content-type":"application/json",
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// config with  dotenv
dotenv.config({ path: "./config/config.env" });

const user = require("./routes/userRoute");

app.use("/api/v1", user);

app.use(errorMiddleware);

module.exports = app;