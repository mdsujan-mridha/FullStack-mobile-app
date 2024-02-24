
// Create Token and saving in cookie

const cookieOptions = require("./cookieOption");

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      ...cookieOptions,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    }).json({
      success: true,
      user,
      token,
    });
};

module.exports = sendToken;