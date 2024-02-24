const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../model/userModel");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require('cloudinary');
const { getDataUri } = require("../utils/ImageData");
const cookieOptions = require("../utils/cookieOption");

// register 
exports.register = catchAsyncErrors(async (req, res, next) => {

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exist", 400));

    let avatar = undefined;

    if (req.file) {
        const file = getDataUri(req.file);
        const myCloud = await cloudinary.v2.uploader.upload(file.content);
        avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    user = await User.create({
        avatar,
        name,
        email,
        password,
    });
    sendToken(user, 201, res);

});

// login 
exports.login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler(" email or password is not correct!", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("incorrect password", 401))
    }
    sendToken(user, 200, res);
});

// logout user 
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            ...cookieOptions,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
        });
});
// get user details 
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    })
});
// forgot password 
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("invalid email", 404));
    }
    // get reset password token and send it to user
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`; //this url for production
    const resetPasswordUrl = `${process.env.FRONTEND_URL}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `You have requested to reset your password, please visit this link to reset your password ${resetPasswordUrl}`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Password reset token",
            message: message,
        });
        res.status(200).json({
            success: true,
            message: "Email sent",
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler("Error sending email", 500));
    }
});
// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(
            new ErrorHandler(
                "Reset Password Token is invalid or has been expired",
                400
            )
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not password", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
});
// update password 
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
});

// get all user by --admin 
exports.getAllUserAdmin = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    })
});

// get single user by --admin
exports.getUserAdmin = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }
    res.status(200).json({
        success: true,
        user,
    })
});
// update user role 
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };
    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
    });
});
// delete user -- admin 
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.params.id);
    // there user params bcz this request will send by admin bt is this request will send bt user then i write (req.user.id)
    if (!user) {
        {
            return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`, 400));
        }
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "user deleted Successfully",
    })
});
// update profile 
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const { name, email, } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
    });
});
exports.updatePic = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const file = getDataUri(req.file);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    const myCloud = await cloudinary.v2.uploader.upload(file.content);
    user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
    };
    await user.save();
    res.status(200).json({
        success: true,
        message: "Avatar Updated Successfully",
    });
});