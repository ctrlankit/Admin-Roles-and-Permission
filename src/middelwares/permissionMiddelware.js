const modelHasRole = require("../models/modelHasRole.model");
const permission = require("../models/permission.model");
const roleHasPermission = require("../models/roleHasPermission.model");

const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const authUser = req.user; //get auth user

      //find user role
      const authUserRole = await modelHasRole.findOne({
        model_id: authUser.id._id,
        model_type: "Admin",
      });

      //find user permissions
      const authUserPermissions = await roleHasPermission.find({
        roleId: authUserRole.role_id,
      });

      //find user permission names
      const authUserPermissionNames = await permission.find({
        _id: {
          $in: authUserPermissions.map((permission) => permission.permissionId),
        },
      });

      if (
        authUserPermissionNames.some((permission) =>
          requiredPermission.includes(permission.name)
        )
      ) {
        next();
      } else {
        res.status(403).json({ status: false, message: "Access denied" });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
};

module.exports = checkPermission;
