const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createExpenseType': {
     return [ 
        body('exp_type_name', 'Expense type name is required').notEmpty(),
        body('user_id', 'user_id is required').notEmpty(),
        body('user_id', 'user_id value must be in integer').isInt(),
       ]   
    }
    case 'updateExpenseType': {
      return [ 
          body('exp_type_name', 'Expense type name is required').notEmpty(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Expense_type = db1.expense_type;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const expense_type = {
      exp_type_name: req.body.exp_type_name,
      user_id: req.body.created_by,
      status:'1',
    };
    Expense_type.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('exp_type_name')), 
        sequelize.fn('lower', req.body.exp_type_name)
      )
    })
      .then((data) => {
        if(!data.length)
          {
            Expense_type.create(expense_type)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Expense_type",
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
  const Expense_type = db1.expense_type;

    Expense_type.findAll({
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
        message: err.message || "Some error occured while retrieving Expense_type",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Expense_type = db1.expense_type;

  Expense_type.findAll()
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
      message: err.message || "Some error occured while retrieving Expense_type",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Expense_type = db1.expense_type;

  const id = req.params.id;
  Expense_type.findByPk(id)
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
        message: "Error retrieving Expense_type with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Expense_type = db1.expense_type;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    Expense_type.update(req.body, {
      where: { exp_type_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Expense_type was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Expense_type with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Expense_type = db1.expense_type;

  const id = req.params.id;
  Expense_type.destroy({
    where: { exp_type_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Expense_type was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Expense_type with id=${id}`,
      });
    }
  });
};

exports.Retailer_exp_type = async (req, res) => {
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
  const Expense_type = db1.expense_type;

  Expense_type.findAll()
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
      message: err.message || "Some error occured while retrieving Expense_type",
    });
  });
};
