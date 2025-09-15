const mongoose = require("mongoose");
const defaultAdminSeeder = require("./defaultAdmin.seeder");
const permissionSeeder = require("./permission.seeder");
const roleSeeder = require("./role.seeder");
const roleHasPermissionSeeder = require("./roleHasPermission.seeder");
const modelHasRoleSeeder = require("./modelHasRole.seeder");
const app = require("../app");


async function runSeeders() {
    console.log(process.env.MONGO_URI);
  try {
    // connect first
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Database connected");

    await defaultAdminSeeder();
    await roleSeeder();
    await permissionSeeder();
    await roleHasPermissionSeeder();
    await modelHasRoleSeeder();

    console.log("All seeders executed successfully");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Database disconnected");
  }
}

runSeeders();
