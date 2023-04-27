const controller = require("../controllers/online_ord_mas.controller");
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
app.post("/add_on_ord_mas", [authJwt.OnlineverifyToken], controller.create);

// Get all Notes
app.get("/all_on_ord_mas/:deptid", [authJwt.verifyToken], controller.findAll);

// Get all Notes
app.get("/all_web/:dept_id/:user_id", [authJwt.verifyToken], controller.findConfirm);

// Get Note by Id
app.get("/e_on_ord_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/cus_ord_details/:cus_id", [authJwt.OnlineverifyToken], controller.findCusDetail);

// Modify existing Note
app.put("/u_on_ord_done/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_on_ord_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/web_graph", [authJwt.verifyToken], controller.online_orders_graph_web);

app.post("/app_graph", [authJwt.verifyToken], controller.online_orders_graph_app);

app.post("/ret_online_live_order", [authJwt.verifyToken], controller.Retailer_online_live_order);

  };