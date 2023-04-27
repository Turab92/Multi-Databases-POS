const { verifySignUp } = require("../../middleware/index");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  
  app.post("/api/auth/retailer_login", controller.retailer_signin);

  app.post("/api/auth/retailer_signin", controller.retailer_phone_check);

  app.post("/api/auth/retailer_pass_set", controller.retailer_password_set);
  // app.get("/login", controller.login);
  // app.get("/register", controller.register);


  app.get("/api/auth/logout", controller.logout);

  app.get("/api/auth/find_data", controller.find_data);
  // app.get('/api/auth/logout', function(req, res) {
  //   res.status(200).send({ auth: false, token: null });
  // });

  // app.get("/dashboard", [authJwt.verifyToken], controller.dashboard);
};