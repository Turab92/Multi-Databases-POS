const controller = require("../controllers/daily_days.controller");
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
app.post("/add_daily_days", [authJwt.verifyToken],controller.validate('createDD'), controller.create);

// Get all Notes
app.get("/all_daily_days/:id", [authJwt.verifyToken], controller.findAll);

app.get("/all_active_day/:id", [authJwt.verifyToken], controller.findActive);

// Get Note by Id
app.get("/e_daily_days/:id", [authJwt.verifyToken], controller.findOne);

app.post("/ret_daily_days", [authJwt.verifyToken], controller.Retailer_DD);

// Modify existing Note
app.put("/u_daily_days/:id", [authJwt.verifyToken],controller.validate('updateDD'), controller.update);

// Delete Note by Id
app.delete("/d_daily_days/:id", [authJwt.verifyToken], controller.delete);

app.post("/dd_report", [authJwt.verifyToken], controller.DDReport);
  };