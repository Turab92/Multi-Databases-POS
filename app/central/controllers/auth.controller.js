const db = require("../models/user");
const config = require("../../confiq/auth.config");
const User = db.users;
const sequelize = require('sequelize');
const Role = db.role;
const Session = db.sessions;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
let sessionData;
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_phone: req.body.user_phone,
    user_pass: bcrypt.hashSync(req.body.user_pass, 8),
    status:'1',
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.status(200).send({ message: "User was registered successfully!" });
           
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.status(200).send({ message: "User was registered successfully!" });
          
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
let token;
exports.signin = (req, res) => {
  
  User.findOne({
    where: 
    // {
    //   user_name: req.body.user_name
    // }
    sequelize.where(
      sequelize.fn('lower', sequelize.col('user_name')), 
      sequelize.fn('lower', req.body.user_name)
    )
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.user_pass,
        user.user_pass
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

       token = jwt.sign({ user }, config.secret, {
        expiresIn: 32400 //9 hours   24 hours  86400
      });
        
      Session.create({
        userid:user.user_id,
        token:token,
      }).then(sessions=>{
        //res.send({ message: "sessions was created" });
        Session.findOne({
          where: {
            token: token
          }
        })
        .then(sessions => {
         
        res.status(200).send({
          user_id: user.user_id,
          user_name: user.user_name,
          user_email: user.user_email,
          roles: user.role_id,
          dept_id: user.dept_id,
          retailer_id: user.retailer_id,
          accessToken: sessions.token,
        });
    })
  })
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
    
    
};

exports.retailer_signin = (req, res) => {
  
  User.findOne({
    where: {
      user_phone: req.body.user_phone
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.user_pass,
        user.user_pass
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

       token = jwt.sign({ user }, config.secret, {
        expiresIn: 32400 //9 hours   24 hours  86400
      });
        
      Session.create({
        userid:user.user_id,
        token:token,
      }).then(sessions=>{
        //res.send({ message: "sessions was created" });
        Session.findOne({
          where: {
            token: token
          }
        })
        .then(sessions => {
         
        res.status(200).send({
          user_id: user.user_id,
          user_name: user.user_name,
          user_email: user.user_email,
          roles: user.role_id,
          dept_id: user.dept_id,
          retailer_id: user.retailer_id,
          accessToken: sessions.token,
        });
    })
  })
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
    
    
};

exports.retailer_phone_check = (req, res) => {
  
  User.findOne({
    where: {
      user_phone: req.body.user_phone
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      else{
        if (user.is_registered == 1) {
          return res.status(200).send({ message: "User Already registered." });
        }else{
          res.status(201).send({
            message: "User not register please set your password",
          });
        }
      }

      
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.retailer_password_set = (req, res) => {
  
  User.findOne({
    where: {
      user_phone: req.body.user_phone
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      else{

          // var passwordIsValid = bcrypt.compareSync(
          //   req.body.new_pass,
          //   req.body.conform_pass
          // );

          if (req.body.new_pass != req.body.conform_pass) {
            return res.status(401).send({
              message: "New Password and Confirm password not match!"
            });
          }
          else{
            User.update({user_pass: bcrypt.hashSync( req.body.conform_pass, 8), is_registered:1}, {
              where: { user_phone: req.body.user_phone },
            }).then((data) => {
              if (data[0] != 0) {
                token = jwt.sign({ user }, config.secret, {
                  expiresIn: 32400 //9 hours   24 hours  86400
                });
                  
                Session.create({
                  userid:user.user_id,
                  token:token,
                }).then(sessions=>{
                  //res.send({ message: "sessions was created" });
                  Session.findOne({
                    where: {
                      token: token
                    }
                  })
                  .then(sessions => {
                   
                  res.status(200).send({
                    user_id: user.user_id,
                    user_name: user.user_name,
                    user_email: user.user_email,
                    roles: user.role_id,
                    dept_id: user.dept_id,
                    retailer_id: user.retailer_id,
                    accessToken: sessions.token,
                  });
              })
            })
              } else {
                res.status(500).send({
                  message: `Cannot update User with id=${req.body.userid}`,
                });
              }
            });
          }

      }

      
  })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};


exports.logout = (req, res) => {

  if (!req.headers["authorization"]) {
    res.status(400).send({
      message: "Authorization token not be empty !",
    });
    return;
  }
  else{
  const auth_token = req.headers["authorization"];
  Session.destroy({
    where: { token: auth_token},
  }).then((data) => {
    if (data) {
      // res.clearCookie("auth-token");
      // res.clearCookie("userid");
      // res.clearCookie("username");
      res.status(200).send({
        message: "Logout Successfully",
      });
      
    } else {
      res.status(500).send({
        message: `Cannot delete User with token=${auth_token}`,
      });
    }
  });
}
};


exports.find_data = (req, res) => {

  let token1 = req.headers["x-access-token"]; //|| req.cookies['auth-token'];
  let token;

  if (!token1) {
    return res.status(403).send({
      message: "No token provided!"
    });
   
  }
  Session.findOne({
    where: {
      token: token1
    }
  })
  .then(sessions => {
    if(!sessions)
    {
      token='nothing';
    }
    else
    {
      token=token1;
    }

  jwt.verify(token, config.secret,async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
        
      });
    }
    res.status(200).send(decoded.user);
  
  });
})
};

// exports.login = (req, res) => {
  
//   res.render("login.ejs")   
// };
// exports.register = (req, res) => {
  
//   res.render("register.ejs")   
// };
// exports.dashboard = (req, res) => {
//   res.render("dashboard.ejs")
// };