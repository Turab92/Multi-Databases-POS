const controller = require("../controllers/custom_sku.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/custom_sku_image',
  filename: function (req, file, fn) {
      console.log(file)
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storageFile }).single('custom_sku_image')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_cus_sku", [authJwt.verifyToken], upload,controller.validate('createCSKU'), controller.create);

// Get all Notes
app.get("/all_cus_sku", [authJwt.verifyToken], controller.findAll);

app.get("/allcusdata", [authJwt.verifyToken], controller.findAllData);

app.get("/allsku_retdata/:retailer_id", [authJwt.verifyToken], controller.findRetailerData);
// Get Note by Id
app.get("/e_cus_sku/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_cus_sku/:id", [authJwt.verifyToken], upload, controller.validate('updateCSKU'), controller.update);

app.put("/ret_approved/:retailer_id/:cus_sku_id", [authJwt.verifyToken], controller.retailer_approval);

// Delete Note by Id
app.delete("/d_cus_sku/:id", [authJwt.verifyToken], controller.delete);
  };