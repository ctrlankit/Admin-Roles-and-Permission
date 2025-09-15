const Role = require("../models/role.model");
const Permission = require("../models/permission.model");
const RoleHasPermission = require("../models/roleHasPermission.model");

async function roleHasPermissionSeeder() {
  const adminRole = await Role.findOne({ name: "SuperAdmin" });
  if (!adminRole) {
    console.log(
      "SuperAdmin role not found, skipping RoleHasPermission seeding"
    );
    return;
  }

  const allPermissions = await Permission.find({});

  for (const perm of allPermissions) {
    const exists = await RoleHasPermission.findOne({
      roleId: adminRole._id,
      permissionId: perm._id,
    });

    if (!exists) {
      await RoleHasPermission.create({
        roleId: adminRole._id,
        permissionId: perm._id,
      });
    }
  }

  console.log("RoleHasPermission seeded");
}

module.exports = roleHasPermissionSeeder;
