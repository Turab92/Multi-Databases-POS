const controller = require("../controllers/vendor_setup.controller");
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
app.post("/add_vendor", [authJwt.verifyToken], controller.validate('createVendor'), controller.create);

// Get all Notes
app.get("/all_vendor", [authJwt.verifyToken], controller.findAll);

app.get("/all_vendor_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_vendor/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_vendor/:retailer_id", [authJwt.verifyToken], controller.Retailer_vendor);

// Modify existing Note
app.put("/u_vendor/:id", [authJwt.verifyToken], controller.validate('updateVendor'), controller.update);

// Delete Note by Id
app.delete("/d_vendor/:id", [authJwt.verifyToken], controller.delete);
  };