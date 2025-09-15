const Permission = require("../models/permission.model");

const permissionsSeeder = async () => {
  try {
    const permissions = [
      { name: "Create Admin" },
      { name: "Edit Admin" },
      { name: "View Admin" },
      { name: "Update Admin" },
      { name: "Delete Admin" },
      { name: "Create Role" },
      { name: "Edit Role" },
      { name: "View Role" },
      { name: "Update Role" },
      { name: "Delete Role" },
      { name: "Create Permission" },
      { name: "Edit Permission" },
      { name: "View Permission" },
      { name: "Update Permission" },
      { name: "Delete Permission" },
    ];

    for (const perm of permissions) {
      const existingPermission = await Permission.findOne({ name: perm.name });
      if (!existingPermission) {
        await Permission.create(perm);
      }
    }

    console.log("✅ Permissions seeded");
  } catch (error) {
    console.error("Error seeding permissions:", error.message);
  }
};

module.exports = permissionsSeeder;
