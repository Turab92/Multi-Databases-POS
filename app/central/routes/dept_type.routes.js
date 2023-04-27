const controller = require("../controllers/dept_type.controller");
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
app.post("/add_dept_type", [authJwt.verifyToken],  controller.validate('createDeptType'), controller.create);

// Get all Notes
app.get("/all_dept_type", [authJwt.verifyToken], controller.findAll);

app.get("/all_dept_type_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_dept_type/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_dept_type/:id", [authJwt.verifyToken],  controller.validate('updateDeptType'), controller.update);

// Delete Note by Id
app.delete("/d_dept_type/:id", [authJwt.verifyToken], controller.delete);
  };