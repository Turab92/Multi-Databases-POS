const controller = require("../controllers/wh_mat_rate.controller");
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
app.post("/add_wh_mat_rate", [authJwt.verifyToken],  controller.validate('createWMR'), controller.create);

// Get all Notes
app.get("/all_wh_mat_rate", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_wh_mat_rate/:id", [authJwt.verifyToken], controller.findOne);

app.get("/find_wh_mat_rate/:deptid/:matid", [authJwt.verifyToken], controller.findRate);// for searching particular material set rates.

app.get("/find_wh_all_rate/:deptid", [authJwt.verifyToken], controller.findAllRate);// for generating material rate quotation.

// Modify existing Note
app.put("/u_wh_mat_rate/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_wh_mat_rate/:id", [authJwt.verifyToken], controller.delete);

app.get("/find_stock_rate/:dept_id/:mat_id", [authJwt.verifyToken], controller.findStockRate);// for current material purchasing rate from vendor. 
  };