const Admin = require("../models/admin.model");
const bcrypt = require("bcryptjs");

const seedDefaultAdmin = async () => {
  try {
    const defaultAdmin = {
      name: "Admin",
      email: "devsoft7pm@gmail.com",
      phone: "1234567890",
    password: "!@admin123",
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: defaultAdmin.email });
    if (!existingAdmin) {
      await Admin.create(defaultAdmin);
      console.log("Default admin created");
    } else {
      console.log("ℹDefault admin already exists");
    }
  } catch (error) {
    console.error("Error creating default admin:", error.message);
  }
};

module.exports = seedDefaultAdmin;