// Bring in the express server
const express = require("express");

// Bring in the Express Router
//const router = express.Router();

// Import the Controller
const controller = require("../controllers/users.controller");
const { authJwt } = require("../../middleware/index");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

 


// Create a new Note
app.post("/adduser", [authJwt.verifyToken],controller.validate('createUser'), controller.create);

// Get all Notes
app.get("/alluser", [authJwt.verifyToken], controller.findAll);

// Get all Notes
app.get("/all_retailer_user/:retailer_id", [authJwt.verifyToken], controller.findAllRetailerUser);

// Get Note by Id
app.get("/e_user/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_user/:id", [authJwt.verifyToken],controller.validate('updateUser'), controller.update);

app.post("/change_password", [authJwt.verifyToken], controller.validate('changePassword'), controller.change_password);

// Delete Note by Id
app.delete("/d_user/:id", [authJwt.verifyToken], controller.delete);
};