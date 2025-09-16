const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden")();
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hide password field
// adminSchema.plugin(mongooseHidden, {hidden: { password: true, updatedAt: true },});  ## mongoose-hidden
adminSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  delete obj.updatedAt;
  return obj;
};

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
