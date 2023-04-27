const controller = require("../controllers/areas.controller");
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
app.post("/add_area", [authJwt.verifyToken],controller.validate('createArea'), controller.create);

// Get all Notes
app.get("/all_active_area",[authJwt.OnlineverifyToken], controller.findAllActive);

app.get("/all_area", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_area/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_area/:retailer_id", [authJwt.verifyToken], controller.Retailer_area);

app.get("/e_on_area/:id",[authJwt.OnlineverifyToken],  controller.findOne);

// Modify existing Note
app.put("/u_area/:id", [authJwt.verifyToken],controller.validate('createArea'), controller.update);

// Delete Note by Id
app.delete("/d_area/:id", [authJwt.verifyToken], controller.delete);
  };