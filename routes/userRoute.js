const express = require('express');
const { register, login, getUserDetails, logout } = require('../controllers/userController');


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(getUserDetails)
router.route("/logout").get(logout);

module.exports = router;