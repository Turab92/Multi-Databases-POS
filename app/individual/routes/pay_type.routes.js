const controller = require("../controllers/pay_type.controller");
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
app.post("/addpaytype", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/allpaytype", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_paytype/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_paytype/:id", [authJwt.verifyToken], controller.update);

// Delete Note by Id
app.delete("/d_paytype/:id", [authJwt.verifyToken], controller.delete);
  };