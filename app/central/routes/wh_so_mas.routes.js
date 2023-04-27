const controller = require("../controllers/wh_so_mas.controller");
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
app.post("/add_wh_so_mas", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_wh_so_mas", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_wh_so_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_wh_so_mas/:dept_id/:retailer_id", [authJwt.verifyToken], controller.findReq);

app.get("/get_so_data/:somid", [authJwt.verifyToken], controller.findData);

app.get("/update_so_prmid/:prmid/:somid", [authJwt.verifyToken], controller.updatePRMID);

// Modify existing Note
app.put("/u_wh_so_mas/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_wh_so_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/wh_so_report", [authJwt.verifyToken], controller.WSO_Report);
  };