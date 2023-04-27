const controller = require("../controllers/online_ord_det.controller");
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
app.get("/add_on_ord_det/:om_id/:subid/:dept_id",[authJwt.OnlineverifyToken], controller.create);

// Create a new Note
app.get("/add_on_od_deal/:om_id/:dealid/:dept_id",[authJwt.OnlineverifyToken], controller.create2);

// Get all Notes
app.get("/all_on_ord_det/:id", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_on_ord_det/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_on_ord_det/:id", [authJwt.verifyToken], controller.update);

// Modify existing Note
app.put("/update_on_detail/:id", [authJwt.verifyToken], controller.update_detail);

// Delete Note by Id
app.delete("/d_on_ord_det/:odid/:omid", [authJwt.verifyToken], controller.delete);
  };