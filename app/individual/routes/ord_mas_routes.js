const controller = require("../controllers/ord_mas.controller");
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
// app.get("/addordmas/:id", [authJwt.verifyToken], controller.create);

// Create a new Note
// app.get("/add_om_deal/:id", [authJwt.verifyToken], controller.create2);

// Get all Notes
app.get("/allordmas", [authJwt.verifyToken], controller.findAll);

app.get("/all_completed/:dept_id", [authJwt.verifyToken], controller.findCompleted);

// Get Note by Id
app.get("/e_ordmas/:id", [authJwt.verifyToken], controller.findOne);

// Get all Notes
app.get("/all_holds/:id", [authJwt.verifyToken], controller.findHolds);

// Modify existing Note
app.put("/u_ord_done/:id", [authJwt.verifyToken], controller.update_done);

// Modify existing Note
app.put("/u_ord_prog/:id", [authJwt.verifyToken], controller.update_prog);

// Modify existing Note
app.put("/unhold_ord/:omid/:userid", [authJwt.verifyToken], controller.unhold_order);

// Delete Note by Id
app.delete("/d_ordmas/:id", [authJwt.verifyToken], controller.delete);

app.get("/all_details", [authJwt.verifyToken], controller.findOrder);

app.get("/all_dept_details/:deptid", [authJwt.verifyToken], controller.findOrder2);

app.get("/check_online_ord/:on_om_id/:userid", [authJwt.verifyToken], controller.check_inprogress_order);

app.post("/br_so_report", [authJwt.verifyToken], controller.BSO_Report);

app.put("/u_order/:id", [authJwt.verifyToken], controller.update_order);

app.post("/br_ord_report", [authJwt.verifyToken], controller.BO_Report);

app.get("/discounted_orders", [authJwt.verifyToken], controller.Discounted_Orders);

app.put("/u_disc_order/:id", [authJwt.verifyToken], controller.update_order_reason);

app.post("/orders_graph", [authJwt.verifyToken], controller.orders_graph);

app.get("/find_cus/:id", [authJwt.verifyToken], controller.findcus);

app.post("/ret_completed_order", [authJwt.verifyToken], controller.Retailer_completed_order);
  };
