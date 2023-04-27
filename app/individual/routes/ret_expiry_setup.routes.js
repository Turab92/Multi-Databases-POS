const controller = require("../controllers/ret_expiry_setup.controller");
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
app.post("/add_ret_exp", [authJwt.verifyToken], controller.validate('createRetExp'), controller.create);

// Get all Notes
app.get("/all_ret_exp", [authJwt.verifyToken], controller.findAll);

app.get("/all_ret_exp_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_ret_exp/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_ret_exp/:id", [authJwt.verifyToken], controller.validate('updateRetExp'), controller.update);

// Delete Note by Id
app.delete("/d_ret_exp/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_return_exp", [authJwt.verifyToken], controller.findAllDB);
  };