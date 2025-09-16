const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminauth.controller");
const authMiddelware = require("../middelwares/authMiddelware");
const validate = require("../middelwares/validationMiddelware");
const adminValidation = require("../requests/adminValidations");

router.post("/login", adminValidation.loginValidation, validate, admin.login);

module.exports = router;
