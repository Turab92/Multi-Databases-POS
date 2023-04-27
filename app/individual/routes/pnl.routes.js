const controller = require("../controllers/pnl.controller");
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
app.post("/add_pnl", [authJwt.verifyToken],  controller.validate('createPNL'), controller.create);

// Get all Notes
app.get("/all_pnl/:deptid", [authJwt.verifyToken], controller.findAll);

app.get("/all_active_pnl/:deptid", [authJwt.verifyToken], controller.findAllActive);

// Get Note by Id
app.get("/e_pnl/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_pnl/:retailer_id", [authJwt.verifyToken], controller.Retailer_pnl);

// Modify existing Note
app.put("/u_pnl/:id", [authJwt.verifyToken], controller.validate('updatePNL'), controller.update);

// Delete Note by Id
app.delete("/d_pnl/:id", [authJwt.verifyToken], controller.delete);

app.post("/pnl_report", [authJwt.verifyToken], controller.BPNL_Report);
  };