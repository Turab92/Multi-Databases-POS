const controller = require("../controllers/subproduct.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/sub_pro_image',
  filename: function (req, file, fn) {
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

//var upload = multer({ storage: storageFile }).single('sub_pro_image')
var upload = multer({ storage: storageFile }).fields([{ name: 'sub_pro_image', maxCount: 1 }, { name: 'sub_pro_app_image', maxCount: 1 }])

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/addsubpro", [authJwt.verifyToken], upload, controller.validate('createSubproduct'), controller.create);

// Get all Notes
app.get("/allsubpro", [authJwt.verifyToken], controller.findAll);

app.get("/allsubprodata", [authJwt.verifyToken], controller.findAllData);

app.get("/allretdata/:retailer_id", [authJwt.verifyToken], controller.findRetailerData);

// Get Note by Id
app.get("/e_subpro/:id", [authJwt.verifyToken], controller.findOne);

// Get Note by Id
app.get("/p_subpro/:id", [authJwt.verifyToken], controller.findPro);

// Get Note by Id
app.get("/branch_subpro/:id", [authJwt.verifyToken], controller.findPro2);

// Get Note by Id
app.get("/find_sub/:name", [authJwt.verifyToken], controller.findSub);

app.get("/sub_receipe", [authJwt.verifyToken], controller.subpro_receipe);

// Modify existing Note
app.put("/u_subpro/:id", [authJwt.verifyToken], upload, controller.validate('updateSubproduct'), controller.update);

// Delete Note by Id
app.delete("/d_subpro/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_sub_pro", [authJwt.verifyToken], controller.findAllDB);
  };