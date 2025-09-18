const Permission = require("../models/permission.model");
const Controller = require("./controller");

class PermissionController extends Controller {
   
    index = async(req, res, next) => {
        try {
            const permissions = await Permission.find();
            return this.successResponse(res, permissions);
        } catch (error) {
            console.error(error);
            return this.errorResponse(res, "!Ops, Something went wrong");
        }
    }
}

module.exports = new PermissionController();
