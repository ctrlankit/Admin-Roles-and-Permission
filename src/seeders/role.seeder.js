const Role = require("../models/role.model");

const roles = [
  { name: "SuperAdmin" },
  { name: "Manager" },
];

async function roleSeeder() {
  for (let i = 0; i < roles.length; i++) {
    const existingRole = await Role.findOne({ name: roles[i].name });
    if (existingRole) continue;

    await Role.create(roles[i]);
  }

  console.log("Roles seeded");
}

module.exports = roleSeeder;
