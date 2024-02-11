const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const errorMiddleware = require("./middleware/error");
const app = express();



// middleware

app.use(express.json());
app.use(cors(
    {
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        // origin: [process.env.FRONTEND_URI_1, process.env.FRONTEND_URI_2],
      }
));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// config with  dotenv
dotenv.config({ path: "./config/config.env" });

// user 
const user = require("./routes/userRoute");
// product 
const product = require("./routes/productRouter");
// order 
const order = require("./routes/orderRouter");
// user 
app.use("/api/v1", user);
// product 
app.use("/api/v1", product);
// order 
app.use("/api/v1", order);
// custom middleware 
app.use(errorMiddleware);

module.exports = app;