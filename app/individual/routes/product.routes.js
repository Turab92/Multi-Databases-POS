// Import the Controller
const controller = require("../controllers/product.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/product_image',
  filename: function (req, file, fn) {
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storageFile }).single('pro_image')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/addproduct", [authJwt.verifyToken], upload, controller.validate('createProd'), controller.create);

// Get all Notes
app.get("/allproduct", [authJwt.verifyToken], controller.findAll);

app.get("/allproduct_web",[authJwt.OnlineverifyToken],  controller.findAll);

app.get("/allproductdata", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_product/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_product/:id", [authJwt.verifyToken], upload, controller.validate('updateProd'), controller.update);

// Delete Note by Id
app.delete("/d_product/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_product", [authJwt.verifyToken], controller.findAllDB);
  };