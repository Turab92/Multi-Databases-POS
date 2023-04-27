const controller = require("../controllers/deal_provider.controller");
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
app.post("/add_deal_prov", [authJwt.verifyToken], controller.validate('createDP'), controller.create);

// Get all Notes
app.get("/all_deal_prov", [authJwt.verifyToken], controller.findAll);

app.get("/all_deal_prov_data", [authJwt.verifyToken], controller.findAllData);

app.get("/all_deal_prov_web",[authJwt.OnlineverifyToken],  controller.findAll);

// Get Note by Id
app.get("/e_deal_prov/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_deal_prov/:id", [authJwt.verifyToken], controller.validate('updateDP'), controller.update);

// Delete Note by Id
app.delete("/d_deal_prov/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_deal_prov", [authJwt.verifyToken], controller.findAllDB);
  };