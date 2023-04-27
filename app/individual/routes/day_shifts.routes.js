const controller = require("../controllers/day_shifts.controller");
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
app.post("/add_day_shifts", [authJwt.verifyToken],controller.validate('createDS'), controller.create);

// Get all Notes
app.get("/all_day_shifts/:id", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_day_shifts/:id", [authJwt.verifyToken], controller.findOne);

app.post("/ret_day_shifts", [authJwt.verifyToken], controller.Retailer_DS);

// Modify existing Note
app.put("/u_day_shifts/:id", [authJwt.verifyToken],controller.validate('updateDS'), controller.update);

app.put("/shift_close/:id", [authJwt.verifyToken],controller.validate('updateDS'), controller.shift_close_update);
// Delete Note by Id
app.delete("/d_day_shifts/:id", [authJwt.verifyToken], controller.delete);

// app.post("/dd_report", [authJwt.verifyToken], controller.DDReport);
  };