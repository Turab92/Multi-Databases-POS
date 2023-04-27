const controller = require("../controllers/mainmenu.controller");
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
app.post("/add_mainmenu", [authJwt.verifyToken], controller.validate('createMain'), controller.create);

// Get all Notes
app.get("/all_mainmenu", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_mainmenu/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_mainmenu/:id", [authJwt.verifyToken], controller.validate('updateMain'), controller.update);

// Delete Note by Id
app.delete("/d_mainmenu/:id", [authJwt.verifyToken], controller.delete);
  };