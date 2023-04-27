const controller = require("../controllers/raw_mat.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/material_image',
  filename: function (req, file, fn) {
      console.log(file)
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storageFile }).single('material_image')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_raw_mat", [authJwt.verifyToken], upload,controller.validate('createRM'), controller.create);

// Get all Notes
app.get("/all_raw_mat", [authJwt.verifyToken], controller.findAll);

app.get("/allrawdata", [authJwt.verifyToken], controller.findAllData);

app.get("/all_br_raw", [authJwt.verifyToken], controller.findBranchRaw);

app.get("/all_ret_raw_mat/:retailer_id", [authJwt.verifyToken], controller.RetailerMaterial);

app.get("/find_mat/:name", [authJwt.verifyToken], controller.findMat);
// Get Note by Id
app.get("/e_raw_mat/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_raw_mat/:id", [authJwt.verifyToken], upload, controller.validate('updateRM'), controller.update);

// Delete Note by Id
app.delete("/d_raw_mat/:id", [authJwt.verifyToken], controller.delete);
  };