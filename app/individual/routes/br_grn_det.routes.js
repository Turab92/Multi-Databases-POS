const controller = require("../controllers/br_grn_det.controller");
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
app.post("/add_br_grn_det", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_br_grn_det", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_br_grn_det/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_br_grn_det/:mas_id", [authJwt.verifyToken], controller.findMas);

app.get("/get_rate/:mat_id/:dept_id", [authJwt.verifyToken], controller.findRate);

app.get("/get_br_avl_qty/:mat_id/:dept_id", [authJwt.verifyToken], controller.findAvailQty);
// Get Complete Inventory
app.get("/get_inventory/:dept_id", [authJwt.verifyToken], controller.findInventory);
// Modify existing Note
app.put("/u_br_grn_det/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_br_grn_det/:id", [authJwt.verifyToken], controller.delete);

app.post("/br_stock_report", [authJwt.verifyToken], controller.RawAvailQtyReport);
  };