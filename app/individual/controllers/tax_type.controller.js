const db = require("../../central/models/user");
const Retailer = db.retailer;
const Sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createTax': {
     return [ 
        body('tax_name', 'Tax name is required').notEmpty(),
        body('tax_percentage', 'Tax percentage is required').notEmpty(),
        body('tax_percentage', 'Tax percentage value must be in integer').isFloat(),
        body('user_id', 'User id is required').notEmpty(),
        body('user_id', 'User id value must be in integer').isInt(),
        body('status', 'Status is required').notEmpty(),
        body('status', 'Status value must be in integer').isInt(),
       ]   
    }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Tax_setup = db1.tax_type;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const tax_type = {
        tax_name: req.body.tax_name,
        tax_percentage: req.body.tax_percentage,
        user_id: req.body.user_id,
        status: req.body.status
      };
      Tax_setup.findAll({
        where: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('tax_name')), 
          Sequelize.fn('lower', req.body.tax_name)
        )
      })
        .then((data) => {
          if(!data.length)
            {
              Tax_setup.create(tax_type)
              .then((data) => {
              res.status(200).send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while create the Tax setup",
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
  const Tax_setup = db1.tax_type;

    Tax_setup.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Tax setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAllActive = (req, res) => {
  const db1=req.ret_db
  const Tax_setup = db1.tax_type;

  Tax_setup.findAll({
    where:{status:1}
  })//findAll return array
  .then((data) => {
      if(!data.length)
      {
         res.status(500).send({
                 message: "Some error occured while retrieving Tax setup",
            });
      }
      else
      {
         res.status(200).send(data[0]);
      }
  })
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Tax_setup = db1.tax_type;

  const id = req.params.id;
  Tax_setup.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Tax setup with id=" + id,
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
  const Tax_setup = db1.tax_type;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      Tax_setup.update(req.body, {
        where: { tax_id: id },
      }).then((data) => {
        if (data[0] != 0) {
          res.status(200).send({
            message: "Tax setup was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update Tax setup with id=${id}`,
          });
        }
      });
    }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Tax_setup = db1.tax_type;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Tax_setup.destroy({
    where: { tax_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Tax setup was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Tax setup with id=${id}`,
      });
    }
  });
};

exports.Retailer_taxtype = async (req, res) => {
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
  const Tax_setup = db1.tax_type;

    Tax_setup.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Tax setup",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};
