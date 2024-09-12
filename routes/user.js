const { postUserSignUp } = require("../controller/userController/userauth");
const { postUserLogin } = require("../controller/userController/userauth");

const express = require("express");
const router = express.Router();

router.post("/user/user-signup", postUserSignUp);

router.post("/user/user-login", postUserLogin);

module.exports = router;
