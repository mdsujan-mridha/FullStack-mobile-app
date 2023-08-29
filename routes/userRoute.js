const express = require('express');
const { register, login, getUserDetails } = require('../controllers/userController');


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(getUserDetails)


module.exports = router;