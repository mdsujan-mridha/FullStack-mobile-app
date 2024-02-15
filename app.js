const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const errorMiddleware = require("./middleware/error");
const app = express();



// middleware

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000',
  'Content-Type': 'Authorization',
  "Content-type": "application/json",
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

// config with  dotenv
dotenv.config({ path: "./config/config.env" });
// todo 
const todo = require("./routes/todoRouter");
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
// todo 
app.use("/api/v1", todo);
// custom middleware 
app.use(errorMiddleware);

module.exports = app;