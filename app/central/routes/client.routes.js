const controller = require("../controllers/client.controller");
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
app.post("/add_client", [authJwt.verifyToken], controller.validate('createClient'), controller.create);

// Get all Notes
app.get("/all_client", [authJwt.verifyToken], controller.findAll);

app.get("/all_client_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_client/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_client/:id", [authJwt.verifyToken], controller.validate('updateClient'), controller.update);

// Delete Note by Id
app.delete("/d_client/:id", [authJwt.verifyToken], controller.delete);
  };