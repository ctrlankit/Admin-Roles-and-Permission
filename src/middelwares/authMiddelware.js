const authToken = require("../models/authToken.model");
const jwt = require("jsonwebtoken");

const authMiddelware = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({success: false, message: "Unauthorized" });
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      checkToken = await authToken
        .where({ token: token })
        .where({ revoked: false })
        .findOne();
      if (!checkToken) return res.status(401).json({success: false, message: "Unauthorized" });
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({success: false, message: "Unauthorized" });
  }
};

module.exports = authMiddelware;
