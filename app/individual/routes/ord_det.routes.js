const controller = require("../controllers/ord_det.controller");
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
// app.get("/add_orddetail/:om_id/:subid/:dept_id", controller.create);

app.post("/addordmas", [authJwt.verifyToken], controller.create);

app.post("/add_om_deal", [authJwt.verifyToken], controller.create2);

app.post("/place_rest_order", [authJwt.verifyToken], controller.order_place);

// Get all Notes
app.get("/all_orddetail/:id", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_orddetail/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_orddetail/:id", [authJwt.verifyToken], controller.update);

app.put("/u_orddetail2/:id", [authJwt.verifyToken], controller.update2);

// Modify existing Note
app.put("/update_detail/:id", [authJwt.verifyToken], controller.update_detail);

// Delete Note by Id
app.delete("/d_orddetail/:odid/:omid", [authJwt.verifyToken], controller.delete);

app.post("/br_sub_sale_report", [authJwt.verifyToken], controller.SubSaleReport);

app.post("/sub_sale_graph", [authJwt.verifyToken], controller.subpro_sale_graph);
  };