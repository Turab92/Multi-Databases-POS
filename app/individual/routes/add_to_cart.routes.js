const controller = require("../controllers/add_to_cart.controller");
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
app.post("/add_cart",[authJwt.OnlineverifyToken], controller.validate('createCart'), controller.create);

// Get all Notes
app.get("/all_cart/:session",[authJwt.OnlineverifyToken], controller.findAll);

app.post("/find_item",[authJwt.OnlineverifyToken], controller.findItem);

// Get Note by Id
app.get("/e_cart/:id",[authJwt.OnlineverifyToken], controller.findOne);

// Modify existing Note
app.put("/u_cart/:id",[authJwt.OnlineverifyToken], controller.validate('updateCart'), controller.update);

// Modify existing Note
app.put("/u_cart_qty/:id",[authJwt.OnlineverifyToken], controller.validate('updateQuantity'), controller.update_qty);

// Delete Note by Id
app.delete("/d_cart/:id",[authJwt.OnlineverifyToken], controller.delete);

app.delete("/d_all_cart/:id",[authJwt.OnlineverifyToken], controller.deleteAll);
  };