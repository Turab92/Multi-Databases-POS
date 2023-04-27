const controller = require("../controllers/br_pr_mas.controller");
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
app.post("/add_br_pr_mas", [authJwt.verifyToken], controller.create);

// Get all Notes
app.get("/all_br_pr_mas", [authJwt.verifyToken], controller.findAll);

// Get Note by Id
app.get("/e_br_pr_mas/:id", [authJwt.verifyToken], controller.findOne);

app.get("/get_br_pr_mas/:dept_id/:retailer_id", [authJwt.verifyToken], controller.findReq);

app.get("/get_br_pr_mas_vendor/:dept_id", [authJwt.verifyToken], controller.findReq2);

app.get("/get_br_req_data/:reqid/:retailer_id", [authJwt.verifyToken], controller.findData);

app.get("/retailer_pr/:retailer_id", [authJwt.verifyToken], controller.Retailer_PR);

// Modify existing Note
app.put("/u_br_pr_mas/:id", [authJwt.verifyToken], controller.update);

app.put("/u_provider/:id", [authJwt.verifyToken], controller.update2);

// Delete Note by Id
app.delete("/d_br_pr_mas/:id", [authJwt.verifyToken], controller.delete);

app.post("/br_pr_report", [authJwt.verifyToken], controller.BPR_Report);
  };