const controller = require("../controllers/expense_out.controller");
const { authJwt } = require("../../middleware/index");
const path = require('path')
const multer = require('multer');
const storageFile = multer.diskStorage({
  destination: './public/paid_invoice_image',
  filename: function (req, file, fn) {
      fn(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storageFile }).single('paid_invoice_img')

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_exp_out", [authJwt.verifyToken],upload, controller.validate('createExpenseOut'), controller.create);

// Get all Notes
app.get("/all_exp_out/:deptid", [authJwt.verifyToken], controller.findAll);

app.get("/all_exp_out_data/:deptid", [authJwt.verifyToken], controller.findAllData);

// Get Note by Id
app.get("/e_exp_out/:id", [authJwt.verifyToken], controller.findOne);

app.get("/ret_exp_out/:retailer_id", [authJwt.verifyToken], controller.Retailer_exp_out);

// Modify existing Note
app.put("/u_exp_out/:id", [authJwt.verifyToken],upload, controller.validate('updateExpenseOut'), controller.update);

// Delete Note by Id
app.delete("/d_exp_out/:id", [authJwt.verifyToken], controller.delete);

app.post("/expense_out_report", [authJwt.verifyToken], controller.BEO_Report);
  };