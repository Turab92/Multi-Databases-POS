const controller = require("../controllers/wh_so_det.controller");
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
app.post("/add_wh_so_det", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_wh_so_det", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_wh_so_det/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_wh_so_det/:mas_id", [authJwt.verifyToken], controller.findMas);

app.get("/est_mat_rate/:material_id/:dept_id", [authJwt.verifyToken], controller.EstPrice);

// Modify existing Note
app.put("/u_wh_so_det/:id", [authJwt.verifyToken], controller.update);

app.put("/u_wh_so_detail/:id", [authJwt.verifyToken], controller.update_detail);

// Delete Note by Id
app.delete("/d_wh_so_det/:id", [authJwt.verifyToken], controller.delete);

app.post("/wh_mat_sal_report", [authJwt.verifyToken], controller.RawSaleReport);

app.post("/wh_mat_sal_graph", [authJwt.verifyToken], controller.mat_sale_graph);
  };