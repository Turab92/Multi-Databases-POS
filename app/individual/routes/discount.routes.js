const controller = require("../controllers/discount.controller");
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
app.post("/add_disc", [authJwt.verifyToken], controller.validate('createDiscount'), controller.create);

// Get all Notes
app.get("/all_disc", [authJwt.verifyToken], controller.findAll);

app.get("/all_disc_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_disc/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_disc/:retailer_id", [authJwt.verifyToken], controller.retailer_dicounts);

// Modify existing Note
app.put("/u_disc/:id", [authJwt.verifyToken], controller.validate('updateDiscount'), controller.update);

// Delete Note by Id
app.delete("/d_disc/:id", [authJwt.verifyToken], controller.delete);
  };