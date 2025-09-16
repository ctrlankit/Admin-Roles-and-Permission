const { body } = require("express-validator");

exports.loginValidation = [
    body("email").notEmpty().withMessage("email is required").isEmail().withMessage("email is not valid"),
    body("password").notEmpty().withMessage("Password is required").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];