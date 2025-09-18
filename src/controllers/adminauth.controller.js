const admin = require("../models/admin.model");
const authToken = require("../models/authToken.model");
const controller = require("./controller");
const generateToken = require("../utils/generateToken");

class AdminAuthController extends controller {
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await admin.findOne({ email: email });

      if (user) {
        const token = await generateToken(user);

        //check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return this.errorResponse(res, "Invalid password");
        }

        //save token
         await authToken.create({
          token: token,
          clientId: user._id,
          revoked: false,
          createdAt: new Date(),
        });

        user._doc.token = token;
        return this.successResponse(res, { data: user });
      } else {
        return this.errorResponse(res, "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };

  createAdmin = async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;

      const user = await admin.create({
        name: name,
        email: email,
        phone: phone,
        password: password,
      });

      if (!user) return this.errorResponse(res, "Admin not created");

      return this.successFullyCreatedResponse(
        res,
        "Admin created successfully"
      );
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };

  updateAdmin = async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const data = {};
      if (name) data.name = name;
      if (email) data.email = email;
      if (phone) data.phone = phone;

      const user = await admin.findByIdAndUpdate(req.user.id._id, data, {
        new: true,
      });

      if (!user) return this.errorResponse(res, "Admin not updated");

      return this.successFullyCreatedResponse(
        res,
        "Admin updated successfully"
      );
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };

  logout = async (req, res) => {
    try {
      const user = await admin.findById(req.user.id._id);
      if (user) {
        const tokens = await authToken.updateMany(
          { clientId: user._id, revoked: false },
          { $set: { revoked: true } }
        );

        if (tokens) {
          return this.successFullyCreatedResponse(res, "Logout successfully");
        }
      } else {
        return this.errorResponse(res, "User not found");
      }
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await admin.findById(req.user.id._id);
      if (user) {
        return this.successResponse(res, user);
      } else {
        return this.errorResponse(res, "User not found");
      }
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };

  deleteAdmin = async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await admin.findByIdAndUpdate(
        id,
        { deletedAt: new Date() },
        {
          new: true,
        }
      );

      if (user) {
        return this.successFullyCreatedResponse(
          res,
          "Admin deleted successfully"
        );
      } else {
        return this.errorResponse(res, "User not found");
      }
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };
}

module.exports = new AdminAuthController();
