
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("./catchAsyncErrors");
const User = require("../model/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData._id);
    next()

})

// authorizeRoles 
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `,
                    403
                )
            );
        }

        next();
    };
};