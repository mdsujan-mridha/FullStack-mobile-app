const ErrorHandler = require("../utils/ErrorHandler");


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Interval server error";

    // Wrong mongodb id error 

    if (err.name === "CastError") {
        const message = `Resources not found with this id..Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    // mongoose duplicate key error 
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    // Wrong JWT error 
    if (err.name === "jsonWebTokenError") {
        const message = `Json Web token is invalid ,tyr again later`;
        err = new ErrorHandler(message, 400);
    }

    // jwt expire Error 
    if (err.name === "TokenExpireError") {
        const message = `Json web token is expired,try again`;
        err = new ErrorHandler(message, 400);
    }



    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}