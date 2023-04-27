const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createArea': {
     return [ 
        body('dept_id', 'status is required').notEmpty(),
        body('dept_id', 'status value must be in integer').isInt(),
        body('area_name', 'Provider name is required').notEmpty(),
        body('delivery_charges', 'Delivery charges value must be in integer').isFloat(),
       ]   
    }
    case 'updateArea': {
      return [ 
          body('dept_id', 'status is required').notEmpty(),
          body('dept_id', 'status value must be in integer').isInt(),
          body('area_name', 'Provider name is required').notEmpty(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
          body('delivery_charges', 'Delivery charges value must be in integer').isFloat(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Areas = db1.areas;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const areas = {
        dept_id: req.body.dept_id,
        area_name: req.body.area_name,
        delivery_charges: req.body.delivery_charges,
        status:'1',
    };
    Areas.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('area_name')), 
        sequelize.fn('lower', req.body.area_name)
      )
    })
      .then((data) => {
        if(!data.length)
          {
            Areas.create(areas)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Area",
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
exports.findAllActive =async (req, res) => {
  const db1=req.ret_db
  const Areas = db1.areas;

  Areas.findAll({
    where:{status:1},
    include: [
        {
          model: db.department_setup,
          as: 'br_area',
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
    message: err.message || "Some error occured while retrieving Area",
  });
});
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Areas = db1.areas;
  
    Areas.findAll({
        include: [
            {
              model: db.department_setup,
              as: 'br_area'
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
        message: err.message || "Some error occured while retrieving Area",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Areas = db1.areas;

  const id = req.params.id;
  Areas.findByPk(id,{
    include: [
        {
          model: db.department_setup,
          as: 'br_area'
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
        message: "Error retrieving Area with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Areas = db1.areas;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Areas.update(req.body, {
      where: { area_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Area was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Area with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Areas = db1.areas;

  const id = req.params.id;
  Areas.destroy({
    where: { area_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Area was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Area with id=${id}`,
      });
    }
  });
};

exports.Retailer_area = async (req, res) => {
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
  const Areas = db1.areas;
  
    Areas.findAll({
        include: [
            {
              model: db.department_setup,
              as: 'br_area'
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
        message: err.message || "Some error occured while retrieving Area",
      });
    });
};
