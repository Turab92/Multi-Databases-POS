const db = require("../../central/models/user");
const Retailer = db.retailer;
const Sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createTill': {
     return [ 
        body('till_name', 'Till name is required').notEmpty(),
        body('dept_id', 'depart is required').notEmpty(),
        body('dept_id', 'depart value must be in integer').isInt(),
        body('pc_name', 'User id is required').notEmpty(),
       ]   
    }
    case 'updateTill': {
      return [ 
         body('till_name', 'Till name is required').notEmpty(),
         body('pc_name', 'User id is required').notEmpty(),
         body('status', 'Status is required').notEmpty(),
         body('status', 'Status value must be in integer').isInt(),
        ]   
     } 
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const till_setup = {
        till_name: req.body.till_name,
        pc_name: req.body.pc_name,
        mac_address: req.body.mac_address,
        ip_address: req.body.ip_address,
        dept_id: req.body.dept_id,
        status: 1
      };
      Till_setup.findAll({
        where: Sequelize.and( {dept_id:req.body.dept_id},
             Sequelize.where(
             Sequelize.fn('lower', Sequelize.col('till_name')), 
             Sequelize.fn('lower', req.body.till_name)
        )
      )})
        .then((data) => {
          if(!data.length)
            {
              Till_setup.create(till_setup)
              .then((data) => {
              res.status(200).send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while create the Till setup",
                });
              });
            }
            else
            {
              res.status(400).send({
                message: "Data Already Exist",
               });
            }
         
        })
        .catch((err) => {
          res.status(502).send({
            message: err.message || "Some error occured while retrieving Product",
          });
        });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const deptid = req.params.deptid;
    Till_setup.findAll({
      where:{dept_id:deptid,status:1,is_active:0}
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Till setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAll2 = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const deptid = req.params.deptid;
    Till_setup.findAll({
      where:{dept_id:deptid},
      include: [
        {
          model: db.department_setup,
          as: 'till_depart'
        }
      ]})//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Till setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAllDropdown = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const deptid = req.params.deptid;
    Till_setup.findAll({
      where:{dept_id:deptid,status:1},
      include: [
        {
          model: db.department_setup,
          as: 'till_depart'
        }
      ]})//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Till setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAll3 = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const deptid = req.params.deptid;
    Till_setup.findAll({
      where:{dept_id:deptid,status:1,is_active:1}
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Till setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const id = req.params.id;
  Till_setup.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Till setup with id=" + id,
           });
     }
     else
     {
        res.status(200).send(data);
     }
     
    })
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;
  const Daily_days = db1.daily_days;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
      Till_setup.findAll({
        where:{till_id:id,is_active:0}
      })//findAll return array
      .then((data) => {
          if(!data.length)
          {
            res.status(502).send({
                    message: "Sorry this till is already alloted please select other till",
                });
          }
          else
          {
            Daily_days.findAll({
            where:{till_id:id,active:1}
            })
            .then((data) => {
              if(!data.length)
              {
                res.status(501).send({
                        message: "No active day found of this till",
                    });
              }
              else
              {
                Till_setup.update(req.body, {
                  where: { till_id: id },
                }).then((data1) => {
                  if (data1[0] != 0) {
                    res.status(200).send(data);
                  } else {
                    res.status(500).send({
                      message: `Cannot update Till setup with id=${id}`,
                    });
                  }
                });
              }
            })
            .catch((err) => {
              res.status(502).send({
                message: err.message || "Some error occured while retrieving Daily days",
              });
            });
          }
      })
};

exports.update2 = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    Till_setup.findAll({
      where:{till_id:id,is_active:1}
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(502).send({
                   message: "Till is already deactive",
              });
        }
        else
        {
           
           Till_setup.update(req.body, {
            where: { till_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Till setup was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Till setup with id=${id}`,
              });
            }
          });
        }
    })
  

};

exports.update3 = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
        Till_setup.update(req.body, {
          where: { till_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Till was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Till setup with id=${id}`,
            });
          }
        });
  }
        
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Till_setup = db1.till_setup;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Till_setup.destroy({
    where: { till_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Till setup was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Till setup with id=${id}`,
      });
    }
  });
};

exports.retailer_till = async (req, res) => {
  var retailer = await Retailer.findByPk(req.params.retailer_id)
  if(!retailer)
    {
       res.status(500).send({
               message: "Sorry! Data Not Found With Id=" + req.params.retailer_id,
          });
    }
    else
    {
      const ret_db = require("../../individual/models/user");
      req.cur_ret_db=ret_db.getdb(retailer.dataValues.retailer_unique_no)
    }
  const db1=req.cur_ret_db
  const Till_setup = db1.till_setup;

    Till_setup.findAll({
      include: [
        {
          model: db.department_setup,
          as: 'till_depart'
        }
      ]})//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Till setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};
