const controller = require("../controllers/deal_item.controller");
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
app.post("/add_deal_item", [authJwt.verifyToken], controller.validate('createDI'), controller.create);

// Get all Notes
app.get("/all_deal_item", [authJwt.verifyToken], controller.findAll);

app.get("/all_deal_item_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_deal_item/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_deal_item/:id", [authJwt.verifyToken], controller.validate('updateDI'), controller.update);

// Delete Note by Id
app.delete("/d_deal_item/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_deal_item", [authJwt.verifyToken], controller.findAllDB);
  };