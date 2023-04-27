const controller = require("../controllers/deal_setup.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/Deal_image',
  filename: function (req, file, fn) {
      console.log(file)
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storageFile }).single('ds_img')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_deal_setup", [authJwt.verifyToken],upload,controller.validate('createDS'), controller.create);

// Get all Notes
app.get("/all_deal_setup", [authJwt.verifyToken], controller.findAll);

app.get("/all_deal_setup_data", [authJwt.verifyToken], controller.findAllData);

app.get("/alldeal_retdata/:retailer_id", [authJwt.verifyToken], controller.findRetailerData);

// Get Note by Id
app.get("/e_deal_setup/:id", [authJwt.verifyToken], controller.findOne);

app.get("/find_deal_item", [authJwt.verifyToken], controller.deal_items);

app.get("/find_active_deal/:deptid", [authJwt.OnlineverifyToken],  controller.findAllActive);

// Get Note by Id
app.get("/p_deal_setup/:id", [authJwt.verifyToken], controller.findPro);

// Modify existing Note
app.put("/u_deal_setup/:id", [authJwt.verifyToken],upload, controller.validate('updateDS'), controller.update);

// Delete Note by Id
app.delete("/d_deal_setup/:id", [authJwt.verifyToken], controller.delete);

app.post("/ret_deal_setup", [authJwt.verifyToken], controller.findAllDB);
  };