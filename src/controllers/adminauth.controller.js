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
        const createToken = await authToken.create({
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
      
      return this.successFullyCreatedResponse(
        res,
        "Admin created successfully"
      );
    } catch (error) {
      console.error(error);
      return this.errorResponse(res, "Oops, something went wrong");
    }
  };
}

module.exports = new AdminAuthController();
