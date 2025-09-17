const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminauth.controller");
const authMiddelware = require("../middelwares/authMiddelware");
const validate = require("../middelwares/validationMiddelware");
const adminValidation = require("../requests/adminValidations");
const checkPermission = require("../middelwares/permissionMiddelware");

router.post("/login", adminValidation.loginValidation, validate, admin.login);

router.use(authMiddelware);
router.post('/create',checkPermission('Create Admin'),adminValidation.createAdmin,validate,admin.createAdmin);

module.exports = router;
