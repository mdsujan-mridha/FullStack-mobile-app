
// Create Token and saving in cookie

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  // options for cookie
  const cookieOptions = {
    secure: process.env.NODE_ENV === "Development" ? false : true,
    httpOnly: process.env.NODE_ENV === "Development" ? false : true,
    sameSite: process.env.NODE_ENV === "Development" ? false : "none",
  };

  res.status(statusCode).cookie("token", token, {
    ...cookieOptions,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  }).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;