const controller = require("../controllers/ord_type.controller");
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
app.post("/addordtype", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/allordtype", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_ordtype/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_ordtype/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_ordtype/:id", [authJwt.verifyToken], controller.delete);
  };