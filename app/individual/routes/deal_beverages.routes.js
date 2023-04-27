const controller = require("../controllers/deal_beverages.controller");
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
app.post("/add_db", [authJwt.verifyToken],controller.validate('createDB'), controller.create);

app.get("/all_db", [authJwt.verifyToken], controller.findAll);

app.get("/all_db_data", [authJwt.verifyToken], controller.findAllData);

app.get("/all_db_ret_data/:retailer_id", [authJwt.verifyToken], controller.findAllRetailerData);

app.get("/deal_bev/:ds_id", [authJwt.verifyToken], controller.findDealBev);

app.get("/app_deal_bev/:ds_id",[authJwt.OnlineverifyToken], controller.findDealBev);

// Get Note by Id
app.get("/e_db/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_db/:id", [authJwt.verifyToken],controller.validate('createDB'), controller.update);

// Delete Note by Id
app.delete("/d_db/:id", [authJwt.verifyToken], controller.delete);
  };