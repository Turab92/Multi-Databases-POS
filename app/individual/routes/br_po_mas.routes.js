const controller = require("../controllers/br_po_mas.controller");
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
app.post("/add_br_po_mas", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_br_po_mas", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_br_po_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_br_po_mas/:dept_id", [authJwt.verifyToken], controller.findReq);

app.get("/update_br_prmid/:prmid/:pomid", [authJwt.verifyToken], controller.updatePRMID);

app.get("/retailer_po/:retailer_id", [authJwt.verifyToken], controller.Retailer_PO);
// Modify existing Note
app.put("/u_br_po_mas/:id", [authJwt.verifyToken], controller.update);

app.get("/get_br_po_data/:somid", [authJwt.verifyToken], controller.findData);

// Delete Note by Id
app.delete("/d_br_po_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/br_po_report", [authJwt.verifyToken], controller.BPO_Report);
  };