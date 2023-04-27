const controller = require("../controllers/retailer.controller");
const { authJwt } = require("../../middleware/index");


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
   // Create a new Note
app.post("/add_retailer",controller.validate('createRetailer'), controller.create);

// Get all Notes
app.get("/all_retailer", [authJwt.verifyToken], controller.findAllActive);

app.get("/all_retailer_data", [authJwt.verifyToken], controller.findAllData);

app.get("/all_retailer_sync", [authJwt.verifyToken], controller.findAllActiveRetailer);

app.post("/all_retailer_table_alter", [authJwt.verifyToken], controller.RetailerTabLeAlter);

app.post("/all_retailer_foreign_table_alter", [authJwt.verifyToken], controller.RetailerForeignTabLeAlter);

app.post("/all_retailer_foreign_table_sync", [authJwt.verifyToken], controller.RetailerForeignTabLeSync);

app.post("/all_retailer_table_column_alter", [authJwt.verifyToken], controller.RetailerTabLeColumnAlter);

app.post("/all_retailer_table_column_datatype_alter", [authJwt.verifyToken], controller.RetailerTabLeColumnDatatypeAlter);
// Get Note by Id
app.get("/e_retailer/:id", [authJwt.verifyToken], controller.findOne);

app.get("/generate_key/:id", [authJwt.verifyToken], controller.GenerateKey);

// Modify existing Note
app.put("/u_retailer/:id", [authJwt.verifyToken], controller.validate('updateRetailer'), controller.update);

// Delete Note by Id
app.delete("/d_retailer/:id", [authJwt.verifyToken], controller.delete);
  };