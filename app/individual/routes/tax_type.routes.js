const controller = require("../controllers/tax_type.controller");
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
app.post("/add_tax", [authJwt.verifyToken], controller.validate('createTax'), controller.create);

// Get all Notes
app.get("/all_tax", [authJwt.verifyToken], controller.findAll);

app.get("/all_active_tax", [authJwt.verifyToken], controller.findAllActive);

app.get("/all_active_tax_app", [authJwt.OnlineverifyToken], controller.findAllActive);

// Get Note by Id
app.get("/e_tax/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_tax/:retailer_id", [authJwt.verifyToken], controller.Retailer_taxtype);

// Modify existing Note
app.put("/u_tax/:id", [authJwt.verifyToken], controller.validate('createTax'), controller.update);

// Delete Note by Id
app.delete("/d_tax/:id", [authJwt.verifyToken], controller.delete);
  };