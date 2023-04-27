const controller = require("../controllers/mat_rate_setup.controller");
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
app.post("/add_mat_rate", [authJwt.verifyToken],  controller.validate('createMR'), controller.create);

// Get all Notes
app.get("/all_mat_rate", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_mat_rate/:id", [authJwt.verifyToken], controller.findOne);

app.get("/find_mat_rate/:id", [authJwt.verifyToken], controller.findRate);

// Modify existing Note
app.put("/u_mat_rate/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_mat_rate/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_mat_rate", [authJwt.verifyToken], controller.findAllDB);
  };