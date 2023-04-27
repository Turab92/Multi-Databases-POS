const controller = require("../controllers/mart_ord_det.controller");
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
//app.get("/add_mart_ord_det/:m_om_id/:mat_cat_id/:material_id/:dept_id", controller.create);

app.post("/add_mart_ordmas", [authJwt.verifyToken], controller.create);

app.post("/place_mart_order", [authJwt.verifyToken], controller.order_place);

// Get all Notes
app.get("/all_mart_ord_det/:id", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_mart_ord_det/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_mart_ord_det/:id", [authJwt.verifyToken], controller.update);

app.put("/u_mart_ord_det1/:id", [authJwt.verifyToken], controller.update1);

app.put("/update_mart_detail/:id", [authJwt.verifyToken], controller.update_detail);
// Delete Note by Id
app.delete("/d_mart_ord_det/:odid/:omid", [authJwt.verifyToken], controller.delete);
  };