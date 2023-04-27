const controller = require("../controllers/sales_return_setup.controller");
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
app.post("/add_sale_return", [authJwt.verifyToken], controller.validate('createSaleReturn'), controller.create);

// Get all Notes
app.get("/all_sale_return", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_sale_return/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_sale_return/:retailer_id", [authJwt.verifyToken], controller.Retailer_sale_return);

// Modify existing Note
app.put("/u_sale_return/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_sale_return/:id", [authJwt.verifyToken], controller.delete);

app.post("/sale_return_report", [authJwt.verifyToken], controller.BSR_Report);
  };