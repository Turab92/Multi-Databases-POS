const controller = require("../controllers/raw_mat_cat.controller");
const { authJwt } = require("../../middleware/index");
//const { authJwt } = require("../../../public/mat_cat_image");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/mat_cat_image',
  filename: function (req, file, fn) {
      console.log(file)
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storageFile }).single('mat_cat_image')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_mat_cat", [authJwt.verifyToken], upload,controller.validate('createRMC'), controller.create);

// Get all Notes
app.get("/all_mat_cat", [authJwt.verifyToken], controller.findAll);

app.get("/find_mat_cat/:name", [authJwt.verifyToken], controller.findMatCat);
// Get Note by Id
app.get("/e_mat_cat/:id", [authJwt.verifyToken], controller.findOne);

app.get("/mat_cat/:id", [authJwt.verifyToken], controller.findCat);

app.get("/find_barcode/:barcode", [authJwt.verifyToken], controller.findBarcode);

// Modify existing Note
app.put("/u_mat_cat/:id", [authJwt.verifyToken], upload, controller.validate('updateRMC'), controller.update);

// Delete Note by Id
app.delete("/d_mat_cat/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_mat_cat", [authJwt.verifyToken], controller.findAllDB);
  };