const controller = require("../controllers/subpro_rate_setup.controller");
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
app.post("/add_sp_rate", [authJwt.verifyToken], controller.validate('createSPR'), controller.create);

// Get all Notes
app.get("/all_sp_rate", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_sp_rate/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_sp_rate/:id", [authJwt.verifyToken], controller.validate('updateSPR'), controller.update);

app.get("/sub_est_rate/:sub_pro_id", [authJwt.verifyToken], controller.EstPrice);
// Delete Note by Id
app.delete("/d_sp_rate/:id", [authJwt.verifyToken], controller.delete);

app.post("/sub_rate_report", [authJwt.verifyToken], controller.SPRateReport);

app.post("/ret_sub_rate", [authJwt.verifyToken], controller.findAllDB);
  };