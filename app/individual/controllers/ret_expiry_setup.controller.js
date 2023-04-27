const db = require("../../central/models/user");
const Retailer = db.retailer;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createRetExp': {
     return [ 
          body('material_id', 'Material is required').notEmpty(),
          body('material_id', 'Material value must be in integer').isInt(),
          body('return_days', 'Return Days is required').notEmpty(),
          body('return_days', 'Return Days value must be in integer').isInt(),
          body('user_id', 'User id is required').notEmpty(),
          body('user_id', 'User id must be in integer').isInt(),
       ]   
    }
    case 'updateRetExp': {
      return [ 
          body('material_id', 'Material is required').notEmpty(),
          body('material_id', 'Material value must be in integer').isInt(),
          body('return_days', 'Return Days is required').notEmpty(),
          body('return_days', 'Return Days value must be in integer').isInt(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Ret_expiry_setup = db1.ret_expiry_setup;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const ret_expiry = {
        material_id: req.body.material_id,
        return_days: req.body.return_days,
        user_id: req.body.user_id,
        status: 1,
      };

      Ret_expiry_setup.create(ret_expiry)
        .then((data) => {
        res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while create the Return expiry",
          });
        });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Ret_expiry_setup = db1.ret_expiry_setup;

    Ret_expiry_setup.findAll({
      where:{status:1},
      include: [
        {
          model: db.raw_material,
          as: 'ret_exp'
        }
      ]
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Return expiry",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Ret_expiry_setup = db1.ret_expiry_setup;

    Ret_expiry_setup.findAll({
      include: [
        {
          model: db.raw_material,
          as: 'ret_exp'
        }
      ]
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Return expiry",
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
  const Ret_expiry_setup = db1.ret_expiry_setup;

  const id = req.params.id;
  Ret_expiry_setup.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Return expiry with id=" + id,
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
  const Ret_expiry_setup = db1.ret_expiry_setup;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
        Ret_expiry_setup.update(req.body, {
          where: { ret_exp_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Return expiry was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Return expiry with id=${id}`,
            });
          }
        });
    }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Ret_expiry_setup = db1.ret_expiry_setup;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Ret_expiry_setup.destroy({
    where: { ret_exp_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Return expiry was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Return expiry with id=${id}`,
      });
    }
  });
};

exports.findAllDB = async (req, res) => {

  var retailer = await Retailer.findByPk(req.body.retailer_id)
  if(!retailer)
    {
       res.status(500).send({
               message: "Sorry! Data Not Found With Id=" + req.body.retailer_id,
          });
    }
    else
    {
      const ret_db = require("../../individual/models/user");
      req.cur_ret_db=ret_db.getdb(retailer.dataValues.retailer_unique_no)
    }
  const db1=req.cur_ret_db
  const Ret_expiry_setup = db1.ret_expiry_setup;

  Ret_expiry_setup.findAll({
    include: [
      {
        model: db.raw_material,
        as: 'ret_exp'
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
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};

