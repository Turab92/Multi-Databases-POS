const controller = require("../controllers/ot_detail.controller");
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
app.post("/add_ot_detail", [authJwt.verifyToken], controller.create);

app.post("/add_ot_mart_detail", [authJwt.verifyToken], controller.create1);

// Get all Notes
app.get("/all_ot_detail", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_ot_detail/:id", [authJwt.verifyToken], controller.findOne);

app.get("/mas_ot_detail/:id", [authJwt.verifyToken], controller.findMas);

// Modify existing Note
app.put("/u_ot_detail/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_ot_detail/:id", [authJwt.verifyToken], controller.delete);
  };