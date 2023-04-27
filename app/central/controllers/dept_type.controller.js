const db = require("../models/user");
const Dept_type = db.dept_type;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDeptType': {
     return [ 
        body('dept_type_name', 'Department type name is required').notEmpty(),
       ]   
    }
    case 'updateDeptType': {
      return [ 
          body('dept_type_name', 'Department type name is required').notEmpty(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const dept_type = {
      dept_type_name: req.body.dept_type_name,
      status:'1',
    };
    Dept_type.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('dept_type_name')), 
        sequelize.fn('lower', req.body.dept_type_name)
      )
    })
      .then((data) => {
        if(!data.length)
          {
            Dept_type.create(dept_type)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Dept Type",
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
    Dept_type.findAll({
      where:{status:1},
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
        message: err.message || "Some error occured while retrieving Dept Type",
      });
    });
};

exports.findAllData = (req, res) => {
  Dept_type.findAll()
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
      message: err.message || "Some error occured while retrieving Dept Type",
    });
  });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Dept_type.findByPk(id)
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
        message: "Error retrieving Dept Type with id=" + id,
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
    Dept_type.update(req.body, {
      where: { dept_type_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Dept Type was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Dept Type with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Dept_type.destroy({
    where: { dept_type_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Dept Type was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Dept Type with id=${id}`,
      });
    }
  });
};


