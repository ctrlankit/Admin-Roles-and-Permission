const express = require("express");
const router = express.Router();
const admin = require("../controllers/adminauth.controller");
const authMiddelware = require("../middelwares/authMiddelware");
const validate = require("../middelwares/validationMiddelware");
const adminValidation = require("../requests/adminValidations");
const checkPermission = require("../middelwares/permissionMiddelware");

router.post("/login", adminValidation.loginValidation, validate, admin.login);

// protected routes
router.use(authMiddelware);

router.post('/create',checkPermission('Create Admin'),adminValidation.createAdmin,validate,admin.createAdmin);
router.put('/update',checkPermission('Update Admin'),adminValidation.updateAdmin,validate,admin.updateAdmin);
router.delete('/delete/:id',checkPermission('Delete Admin'),adminValidation.deleteAdmin,validate,admin.deleteAdmin);
router.post('/logout',admin.logout);
router.get('/getprofile',checkPermission('View Admin'),admin.getProfile);

module.exports = router;
