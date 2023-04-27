const controller = require("../controllers/customer.controller");
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
app.post("/addcustomer", [authJwt.verifyToken],controller.validate('createCustomer'), controller.create);

app.post("/add_mart_customer", [authJwt.verifyToken],controller.validate('createCustomer'), controller.create1);

app.post("/check_customer", [authJwt.OnlineverifyToken], controller.validate('checkCustomer'), controller.check_customer);

app.post("/add_online_customer", [authJwt.OnlineverifyToken], controller.validate('createWebCustomer'), controller.create_online_cus);

// Get all Notes
app.get("/allcustomer", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_customer/:id", [authJwt.verifyToken], controller.findOne);

// Get Note by Id
app.get("/getcustomer/:id", [authJwt.verifyToken], controller.findMas);

app.get("/get_mart_customer/:id", [authJwt.verifyToken], controller.findMC);

// Modify existing Note
app.put("/u_customer/:id", [authJwt.verifyToken],controller.validate('createCustomer'), controller.update);

// Delete Note by Id
app.delete("/d_customer/:id", [authJwt.verifyToken], controller.delete);
  };