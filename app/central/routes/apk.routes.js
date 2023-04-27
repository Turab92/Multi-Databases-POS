const controller = require("../controllers/apk.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/pos_apk',
  filename: function (req, file, fn) {
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

//var upload = multer({ storage: storageFile }).single('sub_pro_image')
var upload = multer({ storage: storageFile }).fields([{ name: 'rest_desktop_apk', maxCount: 1 }, { name: 'rest_android_apk', maxCount: 1 },{ name: 'mart_desktop_apk', maxCount: 1 }, { name: 'mart_android_apk', maxCount: 1 }])

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_apk", [authJwt.verifyToken], upload,  controller.create);

// Get all Notes
app.get("/all_apk", [authJwt.verifyToken], controller.findAll);

app.get("/all_apk_data", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_apk/:id", [authJwt.verifyToken], controller.findOne);

// Modify existing Note
app.put("/u_apk/:id", [authJwt.verifyToken],  controller.update);

// Delete Note by Id
app.delete("/d_apk/:id", [authJwt.verifyToken], controller.delete);

app.get("/test_image", controller.test_image);

  };