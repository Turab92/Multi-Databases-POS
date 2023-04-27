const controller = require("../controllers/tax_calculation.controller");
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
app.post("/add_tax_cal", [authJwt.verifyToken],  controller.validate('createTaxCal'), controller.create);

// Get all Notes
app.get("/all_tax_cal/:deptid", [authJwt.verifyToken], controller.findAll);

app.get("/all_active_tax_cal/:deptid", [authJwt.verifyToken], controller.findAllActive);

// Get Note by Id
app.get("/e_tax_cal/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_tax_cal/:retailer_id", [authJwt.verifyToken], controller.Retailer_tax_cal);

// Modify existing Note
app.put("/u_tax_cal/:id", [authJwt.verifyToken], controller.validate('updateTaxCal'), controller.update);

// Delete Note by Id
app.delete("/d_tax_cal/:id", [authJwt.verifyToken], controller.delete);
  };