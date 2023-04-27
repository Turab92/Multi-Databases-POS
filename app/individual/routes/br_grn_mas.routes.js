const controller = require("../controllers/br_grn_mas.controller");
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
app.post("/add_br_grn_mas", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_br_grn_mas", [authJwt.verifyToken], controller.findAll);

app.get("/update_somid/:somid/:grnmid/:provider", [authJwt.verifyToken], controller.updateSOMID);

// Get Note by Id
app.get("/e_br_grn_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/retailer_grn/:retailer_id", [authJwt.verifyToken], controller.Retailer_GRN);
// Modify existing Note
app.put("/u_br_grn_mas/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_br_grn_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/br_grn_report", [authJwt.verifyToken], controller.BGRN_Report);
  };