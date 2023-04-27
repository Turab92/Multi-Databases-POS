const controller = require("../controllers/printer.controller");
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
app.post("/add_printer", [authJwt.verifyToken], controller.validate('createPrinter'), controller.create);

// Get all Notes
app.get("/all_printer/:deptid", [authJwt.verifyToken], controller.findAll);

app.get("/all_printer_data/:deptid", [authJwt.verifyToken], controller.findAllData);

app.get("/all_till_printer/:deptid/:tillid", [authJwt.verifyToken], controller.findAllTill);

// Get Note by Id
app.get("/e_printer/:id", [authJwt.verifyToken], controller.findOne);

app.post("/ret_printer", [authJwt.verifyToken], controller.Retailer_printer);

// Modify existing Note
app.put("/u_printer/:id", [authJwt.verifyToken], controller.validate('updatePrinter'), controller.update);

// Delete Note by Id
app.delete("/d_printer/:id", [authJwt.verifyToken], controller.delete);

};