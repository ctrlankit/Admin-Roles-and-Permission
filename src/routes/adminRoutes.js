const express = require("express");
const router = express.Router();
const AdminAuthController = require("../controllers/adminauth.controller");
const authMiddelware = require("../middelwares/authMiddelware");
const validate = require("../middelwares/validationMiddelware");
const adminValidation = require("../requests/adminValidations");
const roleValidation = require("../requests/roleValidations");
const RoleController = require("../controllers/role.controller");
const checkPermission = require("../middelwares/permissionMiddelware");

router.post("/login",adminValidation.loginValidation,validate,AdminAuthController.login);

// protected routes
router.use(authMiddelware);

// AdminAuthController routes
router.post('/create',checkPermission('Create Admin'),adminValidation.createAdmin,validate,AdminAuthController.createAdmin);
router.put('/update',checkPermission('Update Admin'),adminValidation.updateAdmin,validate,AdminAuthController.updateAdmin);
router.delete('/delete/:id',checkPermission('Delete Admin'),adminValidation.deleteAdmin,validate,AdminAuthController.deleteAdmin);
router.post('/logout',AdminAuthController.logout);
router.get('/getprofile',checkPermission('View Admin'),AdminAuthController.getProfile);


// role routes
router.post('/role/create',checkPermission('Create Role'),roleValidation.createRole,validate,RoleController.createRole);
router.put('/role/update/:id',checkPermission('Update Role'),roleValidation.updateRole,validate,RoleController.updateRole);
router.delete('/role/delete/:id',checkPermission('Delete Role'),roleValidation.deleteRole,validate,RoleController.deleteRole);
router.get('/role/permissions/:id',checkPermission('View Role'),roleValidation.roleHasPermissions,validate,RoleController.RoleHasPermissions);



module.exports = router;
