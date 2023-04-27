const controller = require("../controllers/wh_po_mas.controller");
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
app.post("/add_wh_po_mas", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_wh_po_mas", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_wh_po_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_po_mas/:dept_id", [authJwt.verifyToken], controller.findReq);

app.get("/update_prmid/:prmid/:pomid", [authJwt.verifyToken], controller.updatePRMID);

// Modify existing Note
app.put("/u_wh_po_mas/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_wh_po_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/wh_po_report", [authJwt.verifyToken], controller.WPO_Report);
  };