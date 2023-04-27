const db = require("../models/user");
const Department_setup = db.department_setup;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');
const Op = require('sequelize').Op;

exports.validate = (method) => {
  switch (method) {
    case 'createDepart': {
     return [ 
        body('dept_name', 'Department name is required').notEmpty(),
        body('retailer_id', 'Retailer is required').notEmpty(),
        body('retailer_id', 'Retailer value must be in integer').isInt(),
        body('dept_type_id', 'Department type is required').notEmpty(),
        body('dept_type_id', 'Department type value must be in integer').isInt(),
        body('owner_name', 'owner name is required').notEmpty(),
        body('owner_phone_no', 'owner phone_no is required').notEmpty(),
        body('owner_phone_no', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }),
        body('owner_email', 'owner email is required').notEmpty(),
        body('shop_address', 'shop address is required').notEmpty(),
       ]   
    }
    case 'updateDepart': {
      return [ 
          body('dept_name', 'Department name is required').notEmpty(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = async (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const department_setup = {
      dept_name: req.body.dept_name,
      dept_type_id: req.body.dept_type_id,
      parent_dept_id: req.body.parent_dept_id,
      retailer_id: req.body.retailer_id,
      owner_name: req.body.owner_name,
      owner_phone_no: req.body.owner_phone_no,
      owner_email: req.body.owner_email,
      shop_address: req.body.shop_address,
      shop_long: req.body.shop_long,
      shop_lat: req.body.shop_lat,
      shop_postal_code: req.body.shop_postal_code,
      shop_country: req.body.shop_country,
      shop_city: req.body.shop_city,
      shop_area: req.body.shop_area,
      shop_open_time: req.body.shop_open_time,
      shop_close_time: req.body.shop_close_time,
      status:'1',
      delivery_status:'0'
    };
    var data1 = await Department_setup.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('dept_name')), 
        sequelize.fn('lower', req.body.dept_name)
      )
    })
        if(!data1.length)
          {
            Department_setup.create(department_setup)
            .then((data1) => {
            res.status(200).send(data1);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Department",
              });
            });
             
          }
          else
          {
            res.status(400).send({
              message: "Data Already Exist",
             });
          }
  }
};

exports.findAll = (req, res) => {
    Department_setup.findAll({
      where:{status:1},
      include: [
        {
          model: db.dept_type,
          as: 'dept_type'
    
        },
        {
          model: db.department_setup,
          as: 'parent_dept'
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
        message: err.message || "Some error occured while retrieving Department",
      });
    });
};

exports.findRetailerDept = (req, res) => {
  Department_setup.findAll({
    where:{status:1,retailer_id:req.params.retailer_id}
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
      message: err.message || "Some error occured while retrieving Department",
    });
  });
};

exports.findAllData = (req, res) => {
  Department_setup.findAll({
    include: [
      {
        model: db.dept_type,
        as: 'dept_type'
  
      },
      {
        model: db.department_setup,
        as: 'parent_dept'
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
      message: err.message || "Some error occured while retrieving Department",
    });
  });
};

exports.findParent = (req, res) => {
  Department_setup.findAll({
    where:{parent_dept_id:null,status:1}
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
      message: err.message || "Some error occured while retrieving Department",
    });
  });
};

exports.findNonParent = (req, res) => {
  Department_setup.findAll({
    where:{parent_dept_id : {[Op.ne]: null},status:1}
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
      message: err.message || "Some error occured while retrieving Department",
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Department_setup.findByPk(id,{
    include: [
      {
        model: db.dept_type,
        as: 'dept_type'
  
      },
      {
        model: db.department_setup,
        as: 'parent_dept'
      }
    ]
  })
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
        message: "Error retrieving Department with id=" + id,
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
    Department_setup.update(req.body, {
      where: { dept_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Department was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Department with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Department_setup.destroy({
    where: { dept_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Department was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Department with id=${id}`,
      });
    }
  });
};


