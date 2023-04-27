const controller = require("../controllers/wh_grn_mas.controller");
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
app.post("/add_wh_grn_mas", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_wh_grn_mas", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_wh_grn_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/update_pomid/:pomid/:grnmid", [authJwt.verifyToken], controller.updatePOMID);

// Modify existing Note
app.put("/u_wh_grn_mas/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_wh_grn_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/wh_grn_report", [authJwt.verifyToken], controller.WGRN_Report);
  };