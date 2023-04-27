const { session } = require("electron");
const jwt = require("jsonwebtoken");
const config = require("../confiq/auth.config.js");
const db = require("../../app/central/models/user");
const User = db.users;
const Session =db.sessions
const Retailer =db.retailer

verifyToken = (req, res, next) => {
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
     // return res.redirect('/login')
    }
    req.userId = decoded.id;
    if(decoded.user.is_retailer == 1)
    {
     var data = await Retailer.findByPk(decoded.user.retailer_id)
          if(!data)
            {
               res.status(500).send({
                       message: "Sorry! Data Not Found With Id=" + decoded.user.retailer_id,
                  });
            }
            else
            {
              const ret_db = require("../individual/models/user");
              req.ret_db=ret_db.getdb(data.dataValues.retailer_unique_no)
              req.ret_dbname = data.dataValues.retailer_unique_no;
            }
    }
    next();
  });
})
};

OnlineverifyToken = async (req, res, next) => {
  let token1 = req.headers["x-access-token"]; //|| req.cookies['auth-token'];

  if (!token1) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
 
     var data = await Retailer.findAll({
       where:{hash_key:token1}
      }
      )
      if(!data)
        {
            res.status(500).send({
                    message: "Sorry! Data Not Found With Id=" + token1,
              });
        }
        else
        {
          console.log(data)
          const ret_db = require("../individual/models/user");
          req.ret_db=ret_db.getdb(data[0].dataValues.retailer_unique_no)
          req.ret_dbname = data[0].dataValues.retailer_unique_no;
        }
    next();
};


emptyCookie = (req, res, next) => {
  let tok=req.cookies['auth-token']
  if(!tok) {
    //return res.redirect('/login');
    res.status(403).send({
      message: "No cookie set!"
    });
}
 next();
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

const authJwt = {
  verifyToken: verifyToken,
  OnlineverifyToken:OnlineverifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;