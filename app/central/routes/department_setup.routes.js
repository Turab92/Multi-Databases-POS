const controller = require("../controllers/department_setup.controller");
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
app.post("/add_depart", [authJwt.verifyToken],controller.validate('createDepart'), controller.create);

// Get all Notes
app.get("/all_depart", [authJwt.verifyToken], controller.findAll);

app.get("/all_depart_data", [authJwt.verifyToken], controller.findAllData);

app.get("/retailer_dept/:retailer_id", [authJwt.verifyToken], controller.findRetailerDept);

app.get("/parent_depart", [authJwt.verifyToken], controller.findParent);

app.get("/non_parent_depart", [authJwt.verifyToken], controller.findNonParent);

// Get Note by Id
app.get("/e_depart/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_depart/:id", [authJwt.verifyToken], controller.validate('updateDepart'), controller.update);

// Delete Note by Id
app.delete("/d_depart/:id", [authJwt.verifyToken], controller.delete);
  };