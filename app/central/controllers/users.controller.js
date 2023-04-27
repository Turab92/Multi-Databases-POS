const db = require("../models/user");
const Users = db.users;
const Op = db.Sequelize.Op;
var bcrypt = require("bcryptjs");
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
     return [ 
        body('user_name', 'Username is required').notEmpty(),
        body('user_email', 'Invalid email').isEmail(),
        body('user_email', 'Email is required').notEmpty(),
        body('user_phone', 'Invalid phone number').optional().isInt(),
        body('user_phone', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }),
        // body('user_pass','User password is required').notEmpty(),
        // body('user_pass','Minimum 8 characters required in Password').isLength({ min: 8 }),
        body('role_id','Role is required').notEmpty(),
        body('role_id','Role value must be in integer').isInt(),
        body('dept_id','department is required').notEmpty(),
        body('dept_id','department value must be in integer').isInt(),
        body('is_retailer','is_retailer is required').notEmpty(),
        body('is_retailer','is_retailer value must be in integer').isInt(),
        //body('retailer_id','retailer_id value must be in integer').isInt().if(body('retailer_id').exists()),
       ]   
    }
    case 'updateUser': {
      return [ 
         body('user_name', 'Username is required').notEmpty(),
         body('user_email', 'Invalid email').isEmail(),
         body('user_email', 'Email is required').notEmpty(),
         body('user_phone', 'Invalid phone number').optional().isInt(),
         body('user_phone', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }),
         body('status','status is required').notEmpty(),
         body('status','Value must be in integer').isInt(),
         body('role_id','Role is required').notEmpty(),
         body('role_id','Role value must be in integer').isInt(),
         //body('dept_id','department is required').notEmpty(),
         //body('dept_id','department value must be in integer').isInt(),
         //body('is_retailer','is_retailer is required').notEmpty(),
         //body('is_retailer','is_retailer value must be in integer').isInt(),
         body('retailer_id','retailer_id value must be in integer').isInt(),
        ]   
     }
     case 'changePassword': {
      return [ 
         body('userid', 'User is required').notEmpty(),
         body('userid','User value must be in integer').isInt(),
         body('old_pass', 'Old Password is required').notEmpty(),
         body('new_pass', 'New Password is required').notEmpty(),
         body('confirm_pass', 'Confirm Pass is required').notEmpty(),
         body('old_pass','Minimum 8 characters required in Password'),
         body('new_pass','Minimum 8 characters required in Password').isLength({ min: 8 }),
         body('confirm_pass','Minimum 8 characters required in Password').isLength({ min: 8 }),
        ]   
     }
  }
}
exports.create = (req, res) => {
  // if (!req.body.user_name) {
  //   res.status(400).send({
  //     message: "Username can not be empty !",
  //   });
  //   return;
  // }
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else{

      const user = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_phone: req.body.user_phone,
        //user_pass: bcrypt.hashSync( req.body.user_pass, 8),
        role_id: req.body.role_id,
        dept_id: req.body.dept_id,
        is_retailer: req.body.is_retailer,
        retailer_id: req.body.retailer_id,
        is_registered: 0,
        status:1,
      };
      Users.findAll({
        //where:{user_email:req.body.user_email,user_phone: req.body.user_phone}
        where: {
          [Op.or]: [{user_email:req.body.user_email}, {user_phone: req.body.user_phone}]
        }
      })
        .then((data) => {
          if(!data.length)
            {
                Users.create(user)
                .then((data) => {
                res.status(200).send(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some error occurred while create the Users",
                  });
                });
            }
            else
            {
              res.status(500).send({
                message: "User email already exist.",
              });
            }
        
        })
        .catch((err) => {
          res.status(502).send({
            message: err.message || "Some error occured while retrieving Users",
          });
        });
  }
};

exports.findAll = (req, res) => {

  Users.findAll({
    include: [
        {
          model: db.role,
          as: 'roles'
        },
        {
          model: db.department_setup,
          as: 'depart'
        }
      ]
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(500).send({
                   message: "Data Not Found",
              });
        }
        else
        {
           res.status(200).send(data);
        }
     
    })
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving Users",
      });
    });
};

exports.findAllRetailerUser = (req, res) => {

  Users.findAll({
    where:{retailer_id:req.params.retailer_id},
    include: [
        {
          model: db.role,
          as: 'roles'
        },
        {
          model: db.department_setup,
          as: 'depart'
        }
      ]
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(500).send({
                   message: "Data Not Found",
              });
        }
        else
        {
           res.status(200).send(data);
        }
     
    })
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving Users",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Users.findByPk(id)
    .then((data) => {
      if(!data)
      {
         res.status(500).send({
                 message: "Sorry! Data Not Found With Id=" + id,
            });
      }
      else
      {
         res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Users with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Users.update(req.body, {
      where: { user_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "User was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update User with id=${id}`,
        });
      }
    });
  }
};

exports.change_password = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else{
        Users.findAll({
          where:{user_id:req.body.userid}
        })
          .then((data) => {
            if(!data.length)
              {
                res.status(500).send({
                        message: "User Not Found",
                    });
              }
              else
              {
                var passwordIsValid = bcrypt.compareSync(
                  req.body.old_pass,
                  data[0].dataValues.user_pass
                );
                if(!passwordIsValid)
                {
                  res.status(203).send({
                    message: "Old Password did not match",
                  });
                }
                else
                  {
                    if(req.body.new_pass == req.body.confirm_pass)
                    {
                      if(req.body.old_pass == req.body.new_pass)
                      {
                        res.status(203).send({
                          message: "Old Password and New Password couldn't be same",
                        });
                      }
                      else
                      {
                        Users.update({user_pass: bcrypt.hashSync( req.body.new_pass, 8)}, {
                          where: { user_id: req.body.userid },
                        }).then((data) => {
                          if (data[0] != 0) {
                            res.status(200).send({
                              message: "User was updated successfully",
                            });
                          } else {
                            res.status(500).send({
                              message: `Cannot update User with id=${req.body.userid}`,
                            });
                          }
                        });
                      }
                    }
                    else
                    {
                        res.status(203).send({
                          message: "New Password and Confirm Password did not match",
                        });
                    }
                  }
              }
          
          })
          .catch((err) => {
            res.status(502).send({
              message: err.message || "Some error occured while retrieving Users",
            });
          });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Users.destroy({
    where: { user_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "User was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete User with id=${id}`,
      });
    }
  });
};


