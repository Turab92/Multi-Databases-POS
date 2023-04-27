const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDiscount': {
     return [ 
        body('comp_name', 'Company name is required').notEmpty(),
        body('disc_amount', 'Discount is required').notEmpty(),
        body('disc_amount', 'Discount value must be in integer').isFloat(),
       ]   
    }
    case 'updateDiscount': {
      return [ 
          body('comp_name', 'Company name is required').notEmpty(),
          body('disc_amount', 'Discount is required').notEmpty(),
          body('disc_amount', 'Discount value must be in integer').isFloat(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Discount = db1.discount;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const discount = {
      comp_name: req.body.comp_name,
      disc_amount: req.body.disc_amount,
      status:'1',
    };
    Discount.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('comp_name')), 
        sequelize.fn('lower', req.body.comp_name)
      )
    })
      .then((data) => {
        if(!data.length)
          {
            Discount.create(discount)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Discount",
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
  const Discount = db1.discount;

    Discount.findAll({
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
        message: err.message || "Some error occured while retrieving Discount",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Discount = db1.discount;

  Discount.findAll()
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
      message: err.message || "Some error occured while retrieving Discount",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Discount = db1.discount;

  const id = req.params.id;
  Discount.findByPk(id)
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
        message: "Error retrieving Discount with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Discount = db1.discount;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    Discount.update(req.body, {
      where: { disc_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Discount was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Discount with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Discount = db1.discount;

  const id = req.params.id;
  Discount.destroy({
    where: { disc_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Discount was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Discount with id=${id}`,
      });
    }
  });
};

exports.retailer_dicounts = async (req, res) => {
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
  const Discount = db1.discount;

  Discount.findAll()
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
      message: err.message || "Some error occured while retrieving Discount",
    });
  });
};
