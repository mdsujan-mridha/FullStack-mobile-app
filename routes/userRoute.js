const express = require('express');
const {
    register,
    login,
    getUserDetails,
    logout,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateUserRole,
    deleteUser,
    getAllUserAdmin
} = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');


const router = express.Router();
// register user 
router.route("/register").post(register);
// login user 
router.route("/login").post(login);
// get logged user details
router.route("/me").get(isAuthenticatedUser, getUserDetails)
// logout user
router.route("/logout").get(logout);
// forgot password 
router.route("/forgot-password").post(forgotPassword);
// reset password 
router.route("/reset-password/:resetToken").put(resetPassword);
// update password 
router.route("/update-password").put(isAuthenticatedUser, updatePassword);
// update profile 
// router.route("/update-profile").put(isAuthenticatedUser, updateProfile);
// get all user by admin 

// get all user by admin 
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUserAdmin);

// get a single user by admin
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
;

module.exports = router;