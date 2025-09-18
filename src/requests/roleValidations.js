const { body } = require("express-validator");
const Permission = require("../models/permission.model");
const Role = require("../models/role.model");
const { param } = require("express-validator");

exports.createRole = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name is not valid")
    .custom(async (value) => {
      const existingRole = await Role.findOne({ name: value }).where({
        deleted_at: null,
      });
      if (existingRole) {
        throw new Error("Role already exists");
      }
      return true;
    }),
  body("permissions")
    .isArray({ min: 1 })
    .withMessage("permissions are required")
    .isMongoId()
    .withMessage("permission is not valid")
    .custom(async (value) => {
      for (const perm of value) {
        const permission = await Permission.findById(perm);
        if (!permission) {
          throw new Error("Permission not found");
        }
      }
      return true;
    }),
];

exports.updateRole = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("id is not valid")
    .custom(async (value) => {
      const role = await Role.findById(value).where({ deleted_at: null });
      if (!role) throw new Error("Role not found");
      return true;
    }),
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name is not valid")
    .custom(async (value, { req }) => {
      const roleId = req.params.id;
      const existingRole = await Role.findOne({
        name: value,
        _id: { $ne: roleId },
      }).where({ deleted_at: null });
      if (existingRole) {
        throw new Error("Role already exists");
      }
      return true;
    }),
  body("permissions")
    .optional()
    .isArray({ min: 1 })
    .withMessage("permissions must be an array")
    .custom(async (value) => {
      for (const perm of value) {
        const permission = await Permission.findById(perm);
        if (!permission) throw new Error(`Permission not found: ${perm}`);
      }
      return true;
    }),
];

exports.deleteRole = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("id is not valid")
    .custom(async (value) => {
      const role = await Role.findById(value).where({ deleted_at: null });
      if (!role) {
        throw new Error("Role not found");
      }
      return true;
    }),
];

exports.roleHasPermissions = [
  param("id")
    .notEmpty()
    .withMessage("id is required")
    .custom(async (value) => {
      const role = await Role.findById(value).where({ deleted_at: null });
      if (!role) {
        throw new Error("Role not found");
      }
      return true;
    }),
  body("search_key")
    .optional()
    .isString()
    .withMessage("search_key is not valid"),
  body("per_page").optional().isNumeric().withMessage("per_page is not valid"),
  body("paginate")
    .optional()
    .custom((value) => {
      if (
        value !== true &&
        value !== false &&
        value !== "true" &&
        value !== "false"
      ) {
        throw new Error("paginate must be either true or false");
      }
      return true;
    }),
];
