const controller = require("../controllers/expense_type.controller");
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
app.post("/add_exp_type", [authJwt.verifyToken], controller.validate('createExpenseType'), controller.create);

// Get all Notes
app.get("/all_exp_type", [authJwt.verifyToken], controller.findAll);

app.get("/all_exp_type_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_exp_type/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_exp_type/:retailer_id", [authJwt.verifyToken], controller.Retailer_exp_type);

// Modify existing Note
app.put("/u_exp_type/:id", [authJwt.verifyToken], controller.validate('updateExpenseType'), controller.update);

// Delete Note by Id
app.delete("/d_exp_type/:id", [authJwt.verifyToken], controller.delete);
  };