const controller = require("../controllers/till_setup.controller");
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
app.post("/add_till", [authJwt.verifyToken], controller.validate('createTill'), controller.create);

// Get all Notes
app.get("/all_till_active/:deptid", [authJwt.verifyToken], controller.findAll);

app.get("/all_till/:deptid", [authJwt.verifyToken], controller.findAll2);

app.get("/all_till_dropdown/:deptid", [authJwt.verifyToken], controller.findAllDropdown);

app.get("/all_till_empty/:deptid", [authJwt.verifyToken], controller.findAll3);

// Get Note by Id
app.get("/e_till/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_till/:retailer_id", [authJwt.verifyToken], controller.retailer_till);

// Modify existing Note
app.put("/u_till/:id", [authJwt.verifyToken], controller.update);

app.put("/u_till_logout/:id", [authJwt.verifyToken], controller.update2);

app.put("/u_till_data/:id", [authJwt.verifyToken],  controller.validate('updateTill'),controller.update3);

// Delete Note by Id
app.delete("/d_till/:id", [authJwt.verifyToken], controller.delete);
  };