const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
const RoleHasPermission = require("../models/roleHasPermission.model");
const Controller = require("./controller");
const commonservice = require("../services/commonservice.js");

class RoleController extends Controller {
  createRole = async (req, res, next) => {
    try {
      const { name, permissions } = req.body;

      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return this.errorResponse(res, "This Role already exists");
      }
      const createRole = await Role.create({ name });

      if (!createRole) {
        return this.errorResponse(res, "Failed to create role");
      }

      for (const perm of permissions) {
        const existingPermission = await Permission.findById(perm);
        if (!existingPermission) {
          return this.errorResponse(res, "Permission not found");
        }
        await RoleHasPermission.create({
          roleId: createRole._id,
          permissionId: perm,
        });
      }
      return this.successFullyCreatedResponse(res, "Role created successfully");
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "!Ops, Something went wrong");
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;

      const role = await Role.findOneAndUpdate(
        { _id: id },
        { name: name },
        { new: true }
      );
      if (!role) {
        return this.errorResponse(res, "Role not found");
      }

      for (const permId of permissions) {
        await RoleHasPermission.findOneAndUpdate(
          { roleId: id, permissionId: permId },
          { $set: { updatedAt: new Date() } },
          { upsert: true }
        );
      }

      return this.successFullyCreatedResponse(res, "Role updated successfully");
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "!Ops, Something went wrong");
    }
  };

  deleteRole = async (req, res, next) => {
    try {
      const { id } = req.params;

      const role = await Role.findById(id);
      if (role) {
        role.deleted_at = new Date();
        role.save();
        return this.successFullyCreatedResponse(
          res,
          "Role deleted successfully"
        );
      } else {
        return this.errorResponse(res, "Role not found");
      }
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "!Ops, Something went wrong");
    }
  };

  RoleHasPermissions = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { search_key, per_page,page = 1,paginate } = req.body;
      
      const role = await Role.findById(id);

      if (!role) {
        return this.errorResponse(res, "Role not found");
      }

      const roleHasPermissions = await RoleHasPermission.find({
        roleId: id,
      }).select("permissionId");

      if (!roleHasPermissions) {
        return this.errorResponse(res, "Role has no permissions");
      }

      const permissionIds = roleHasPermissions.map((rp) => rp.permissionId);

      let query = Permission.find({
        _id: { $in: permissionIds },
      });

      //search filter
      if (
        typeof search_key !== "undefined" &&
        search_key !== null &&
        search_key.trim() !== ""
      ) {
        query = query.where({ name: { $regex: search_key, $options: "i" } });
      }

      if (paginate === "true") 
      {
        const paginatedResult = await commonservice.paginate(Permission,query,page,per_page)
        return this.successResponse(res, paginatedResult.data, paginatedResult.meta);
      } else {
        const results = await query.exec();
        return this.successResponse(res, results);
      }
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "!Ops, Something went wrong");
    }
  };
}

module.exports = new RoleController();
