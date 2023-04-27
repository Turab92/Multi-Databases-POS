const controller = require("../controllers/exchange_setup.controller");
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
app.post("/add_exchange", [authJwt.verifyToken], controller.validate('createExchange'), controller.create);

// Get all Notes
app.get("/all_exchange", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_exchange/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_sale_exchange/:retailer_id", [authJwt.verifyToken], controller.Retailer_sale_exchange);
// Modify existing Note
app.put("/u_exchange/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_exchange/:id", [authJwt.verifyToken], controller.delete);

app.post("/exchange_report", [authJwt.verifyToken], controller.BSE_Report);
  };