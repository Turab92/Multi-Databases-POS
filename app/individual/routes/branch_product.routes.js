const controller = require("../controllers/branch_product.controller");
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
app.post("/add_br_prod", [authJwt.verifyToken], controller.validate('createBranchProd'), controller.create);

// Get all Notes
app.get("/all_br_prod/:deptid", [authJwt.verifyToken], controller.findAll);

app.post("/retailer_br_prod", [authJwt.verifyToken], controller.findAllDB);

// Get Note by Id
app.get("/e_br_prod/:id", [authJwt.verifyToken], controller.findOne);

app.get("/find_active/:deptid", [authJwt.OnlineverifyToken],  controller.findAllActive);

// Modify existing Note
app.put("/u_br_prod/:id", [authJwt.verifyToken], controller.validate('updateBranchProd'), controller.update);

// Delete Note by Id
app.delete("/d_br_prod/:id", [authJwt.verifyToken], controller.delete);
  };