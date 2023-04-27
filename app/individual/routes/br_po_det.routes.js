const controller = require("../controllers/br_po_det.controller");
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
app.post("/add_br_po_det", [authJwt.verifyToken], controller.create);

app.get("/all_br_po_det", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_br_po_det/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_br_po_det/:mas_id", [authJwt.verifyToken], controller.findMas);

// Modify existing Note
app.put("/u_br_po_det/:id", [authJwt.verifyToken], controller.update);

app.get("/est_rate/:material_id/:dept_id", [authJwt.verifyToken], controller.EstPrice);
// Delete Note by Id
app.delete("/d_br_po_det/:id", [authJwt.verifyToken], controller.delete);
  };