const app = require("./app");

const dotenv = require("dotenv");
const cloudinary = require("cloudinary");
const database = require("./config/dbConnection");
const { Server } = require("socket.io");
const { createServer } = require("http");
const port = process.env.PORT || 5000;


// connect with socket 
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// io.on("connection", (socket) => {
//     console.log("user connected", socket.id);
//     // console.log("user connected",socket);


// });

// io.on('receive-message', (socket) => {
//     socket.on('chat message', (msg) => {
//         io.emit('chat message', msg);
//     });
// });

// io.on("message", (message) => {
//     console.log(message)
// })


// handle uncaught Exception 
process.on("uncaughtException", err => {
    console.log(`Err : ${err.message}`);
    console.log(` Shutting down the server due to uncaught Exception `);
    process.exit(1);
});

// dotenv config 
dotenv.config({ path: "./config/config.env" });

// connect with database 
database();
// config clourinary 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

server.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});




// UnHandle Promise Rejection 
process.on("unhandledRejection", err => {

    console.log(`Err : ${err.message}`);

    console.log(` Shutting down the server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    });

});