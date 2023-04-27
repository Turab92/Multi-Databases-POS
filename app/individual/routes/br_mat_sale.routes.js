const controller = require("../controllers/br_mat_sale.controller");
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
app.post("/add_br_mat_sale", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_br_mat_sale", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_br_mat_sale/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_br_mat_sale/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_br_mat_sale/:id", [authJwt.verifyToken], controller.delete);

app.post("/br_mat_sal_report", [authJwt.verifyToken], controller.RawSaleReport);

app.post("/br_mat_sal_graph", [authJwt.verifyToken], controller.mat_sale_graph);
  };