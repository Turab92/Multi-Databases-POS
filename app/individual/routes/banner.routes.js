const controller = require("../controllers/banner.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/Banner',
  filename: function (req, file, fn) {
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storageFile }).fields([{ name: 'web_banner', maxCount: 1 }, { name: 'app_banner', maxCount: 1 }])


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_banner", [authJwt.verifyToken],upload,controller.validate('createBanner'), controller.create);

// Get all Notes
app.get("/all_banner", [authJwt.verifyToken], controller.findAll);

app.get("/banner/:deptid",[authJwt.OnlineverifyToken], controller.findDeptAll);

// Get Note by Id
app.get("/e_banner/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_banner/:retailer_id", [authJwt.verifyToken], controller.Retailer_banner);

// Modify existing Note
app.put("/u_banner/:id", [authJwt.verifyToken],upload, controller.validate('updateBanner'), controller.update);

// Delete Note by Id
app.delete("/d_banner/:id", [authJwt.verifyToken], controller.delete);
  };