const controller = require("../controllers/prod_cost.controller");
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
app.post("/add_prod_cost", [authJwt.verifyToken], controller.validate('createPC'),controller.create);

// Get all Notes
app.get("/all_prod_cost", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_prod_cost/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_prod_cost/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_prod_cost/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_prod_cost", [authJwt.verifyToken], controller.findAllDB);
  };