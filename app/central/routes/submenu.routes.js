const controller = require("../controllers/submenu.controller");
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
app.post("/add_submenu", [authJwt.verifyToken], controller.validate('createSubmenu'), controller.create);

// Get all Notes
app.get("/all_submenu", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_submenu/:id", [authJwt.verifyToken], controller.findOne);

// Get Note by Id
app.get("/mainsub/:id", [authJwt.verifyToken], controller.findMain);

// Modify existing Note
app.put("/u_submenu/:id", [authJwt.verifyToken], controller.validate('updateSubmenu'), controller.update);

// Delete Note by Id
app.delete("/d_submenu/:id", [authJwt.verifyToken], controller.delete);
  };