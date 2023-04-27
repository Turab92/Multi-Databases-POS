const controller = require("../controllers/role_permission.controller");
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
app.post("/add_role_perm", [authJwt.verifyToken], controller.validate('createRolePerm'), controller.create);

// Get all Notes
app.get("/all_role_perm", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_role_perm/:id", [authJwt.verifyToken], controller.findOne);

app.get("/main_perm/:id", [authJwt.verifyToken], controller.findmain1);

// Modify existing Note
app.put("/u_role_perm/:id", [authJwt.verifyToken], controller.validate('createRolePerm'), controller.update);

// Delete Note by Id
app.delete("/d_role_perm/:id", [authJwt.verifyToken], controller.delete);
  };