const controller = require("../controllers/raw_mat_det.controller");
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
app.post("/add_mat_det", [authJwt.verifyToken], controller.validate('createRMD'), controller.create);

// Get all Notes
app.get("/all_mat_det", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_mat_det/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_mat_det/:id", [authJwt.verifyToken], controller.validate('updateRMD'), controller.update);

// Delete Note by Id
app.delete("/d_mat_det/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_mat_det", [authJwt.verifyToken], controller.findAllDB);
  };