const { body } = require("express-validator");
const { param } = require("express-validator");
const role = require("../models/role.model");
const admin = require("../models/admin.model");

exports.loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.createAdmin = [
  body("name").notEmpty().withMessage("name is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid")
    .custom(async (value) => {
      const newAdmin = await admin.findOne({ email: value });
      if (newAdmin) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isNumeric()
    .withMessage("phone is not valid")
    .custom(async (value) => {
      const newAdmin = await admin.findOne({ phone: value });
      if (newAdmin) {
        throw new Error("Phone already exists");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .isLength({ min: 6 })
    .withMessage("confirmPassword must be at least 6 characters")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("role_id")
    .notEmpty()
    .withMessage("role id is required")
    .isMongoId()
    .withMessage("role_id is not valid")
    .custom(async (value) => {
      const roleDoc = await role.findById(value);
      if (!roleDoc) {
        throw new Error("Role not found");
      }
      return true;
    }),
];

exports.updateAdmin = [
  body("name").optional().isString().withMessage("name is not valid"),
  body("email").optional().isEmail().withMessage("email is not valid"),
  body("phone").optional().isNumeric().withMessage("phone is not valid"),
  body("role_id")
    .optional()
    .isMongoId()
    .withMessage("role_id is not valid")
    .custom(async (value) => {
      const roleDoc = await role.findById(value);
      if (!roleDoc) {
        throw new Error("Role not found");
      }
      return true;
    }),
];

exports.deleteAdmin = [
  param("id")
    .isMongoId()
    .withMessage("adminId is not valid")
    .custom(async (value) => {
      const adminDoc = await admin.findById(value);
      if (!adminDoc) {
        throw new Error("Admin not found");
      }
      return true;
    }),
];
