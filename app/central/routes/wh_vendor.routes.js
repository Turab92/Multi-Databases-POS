const controller = require("../controllers/wh_vendor.controller");
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
app.post("/add_wh_vendor", [authJwt.verifyToken], controller.validate('createWHVendor'), controller.create);

// Get all Notes
app.get("/all_wh_vendor", [authJwt.verifyToken], controller.findAll);

app.get("/all_wh_vendor_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_wh_vendor/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_wh_vendor/:id", [authJwt.verifyToken], controller.validate('updateWHVendor'), controller.update);

// Delete Note by Id
app.delete("/d_wh_vendor/:id", [authJwt.verifyToken], controller.delete);
  };