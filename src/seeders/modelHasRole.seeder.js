const ModelHasRole = require("../models/modelHasRole.model");
const Role = require("../models/role.model");
const Admin = require("../models/admin.model");

const seedModelRole = async () => {
  try {
    const role = await Role.findOne({ name: "SuperAdmin" });
    if (!role) {
      console.error("Role SuperAdmin not found");
      return;
    }

    const admin = await Admin.findOne({ email: "devsoft7pm@gmail.com" });
    if (!admin) {
      console.error("Admin with given email not found");
      return;
    }

    const modelRole = {
      role_id: role._id,
      model_type: "Admin",
      model_id: admin._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const existingModelRole = await ModelHasRole.findOne(modelRole);
    if (existingModelRole) {
      console.log("SuperAdmin role already assigned to admin");
      return;
    } else {
      await ModelHasRole.create(modelRole);
    }

    console.log("SuperAdmin role assigned to admin");
  } catch (err) {
    console.error("Error seeding model role:", err.message);
  }
};

module.exports = seedModelRole;
