const controller = require("../controllers/wh_grn_det.controller");
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
app.post("/add_wh_grn_det", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_wh_grn_det", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_wh_grn_det/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_wh_grn_det/:mas_id", [authJwt.verifyToken], controller.findMas);

app.get("/get_avl_qty/:mat_id/:par_dept_id", [authJwt.verifyToken], controller.findAvailQty);

// app.get("/get_det_avl_qty/:mat_id/:par_dept_id/:qty", [authJwt.verifyToken], controller.findRawAvailQty);

// Modify existing Note
app.put("/u_wh_grn_det/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_wh_grn_det/:id", [authJwt.verifyToken], controller.delete);

app.post("/wh_stock_report", [authJwt.verifyToken], controller.RawAvailQtyReport);
  };