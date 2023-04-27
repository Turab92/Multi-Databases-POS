const controller = require("../controllers/customer_address.controller");
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
app.post("/add_cus_add",  [authJwt.OnlineverifyToken],  controller.validate('createCA'), controller.create);

// Get all Notes
app.get("/all_cus_add/:cusid", [authJwt.OnlineverifyToken],  controller.findAll);

// Get Note by Id
app.get("/e_cus_add/:id", [authJwt.OnlineverifyToken],  controller.findOne);

// Modify existing Note
app.put("/u_cus_add/:id", [authJwt.OnlineverifyToken],  controller.validate('updateCA'), controller.update);

// Delete Note by Id
app.delete("/d_cus_add/:id", [authJwt.OnlineverifyToken],  controller.delete);
  };