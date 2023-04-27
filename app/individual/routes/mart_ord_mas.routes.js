const controller = require("../controllers/mart_ord_mas.controller");
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
//app.get("/add_mart_ord_mas/:mat_cat_id", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_mart_ord_mas", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_mart_ord_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/all_mart_holds/:id", [authJwt.verifyToken], controller.findMartHolds);

app.get("/mart_ot_detail/:id", [authJwt.verifyToken], controller.findOD);

app.get("/mart_pt_detail/:id", [authJwt.verifyToken], controller.findPD);

app.put("/u_ord_prog_mart/:id", [authJwt.verifyToken], controller.update_prog);
// Modify existing Note
app.put("/u_mart_ord_mas/:id", [authJwt.verifyToken], controller.update);

app.put("/unhold_mart_ord/:omid/:userid", [authJwt.verifyToken], controller.unhold_order);

app.put("/u_mart_ord_done/:id", [authJwt.verifyToken], controller.update_done);
// Delete Note by Id
app.delete("/d_mart_ord_mas/:id", [authJwt.verifyToken], controller.delete);

app.get("/all_mart_details", [authJwt.verifyToken], controller.findOrder);

app.get("/all_mart_details/:deptid", [authJwt.verifyToken], controller.findOrder2);

app.post("/br_so_mart_report", [authJwt.verifyToken], controller.BSO_Report);

app.post("/br_ord_mart_report", [authJwt.verifyToken], controller.BO_Report);

app.post("/mart_orders_graph", [authJwt.verifyToken], controller.orders_graph);

app.get("/find_mart_cus/:id", [authJwt.verifyToken], controller.findcus);
  };