const controller = require("../controllers/comp_detail.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/company_images',
  filename: function (req, file, fn) {
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

// Create multer for store images path
var upload = multer({ storage: storageFile }).fields([{ name: 'comp_logo', maxCount: 1 }, { name: 'comp_favicon', maxCount: 1 }])

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/addcompdet", [authJwt.verifyToken], upload, controller.validate('createCompDet'), controller.create);

// Get all Notes
app.get("/allcompdet", [authJwt.verifyToken], controller.findAll);

app.get("/allcomp_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_compdet/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_compdet/:id", [authJwt.verifyToken], upload, controller.validate('updateCompDet'), controller.update);

// Delete Note by Id
app.delete("/d_compdet/:id", [authJwt.verifyToken], controller.delete);

};