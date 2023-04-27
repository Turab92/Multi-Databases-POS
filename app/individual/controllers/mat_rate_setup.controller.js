const db = require("../../central/models/user");
const Retailer = db.retailer;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createMR': {
     return [ 
        body('material_id', 'Material is required').notEmpty(),
        body('material_id', 'Material value must be in integer').isInt(),
        body('mat_current_rate', 'Material Sale Rate is required').notEmpty(),
        body('mat_current_rate', 'Material Sale Rate value must be in integer').isFloat(),
        body('mat_purchase_rate', 'Material Purchase Rate is required').notEmpty(),
        body('mat_purchase_rate', 'Material Purchase Rate value must be in integer').isFloat(),
        body('user_id', 'User id is required').notEmpty(),
        body('user_id', 'User id value must be in integer').isInt(),
       ]   
    }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Mat_rate_setup = db1.mat_rate_setup;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      const mat_rate_setup = {
        material_id: req.body.material_id,
        mat_current_rate: req.body.mat_current_rate,
        mat_purchase_rate: req.body.mat_purchase_rate,
        user_id: req.body.user_id,
        status:'1',
      };

      Mat_rate_setup.findAll({
          where: {material_id:req.body.material_id}
      })
        .then((data) => {
          if(!data.length)
          {
            Mat_rate_setup.create(mat_rate_setup)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Material Rate",
              });
            });
          }
          else
          {
            const mat_rate_update = {
                status:'0',
              };
            Mat_rate_setup.update(mat_rate_update, {
                where: { material_id: req.body.material_id },
              }).then((data) => {
                if (data[0] != 0) {
                    Mat_rate_setup.create(mat_rate_setup)
                    .then((data) => {
                    res.status(200).send(data);
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message: err.message || "Some error occurred while create the Material Rate",
                      });
                    });
                } else {
                  res.status(500).send({
                    message: `Cannot update Material with id=${id}`,
                  });
                }
              });
          }
        })
        .catch((err) => {
          res.status(502).send({
            message: err.message || "Some error occured while retrieving Material Rate",
          });
        });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Mat_rate_setup = db1.mat_rate_setup;

    Mat_rate_setup.findAll({
      include: [
        {
          model: db.raw_material,
          as: 'mat'
    
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
        message: err.message || "Some error occured while retrieving Material Rate",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Mat_rate_setup = db1.mat_rate_setup;

  const id = req.params.id;
  Mat_rate_setup.findByPk(id,{
    include: [
      {
        model: db.raw_material,
        as: 'mat'
  
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
        message: "Error retrieving Material Rate with id=" + id,
      });
    });
};

exports.findRate = (req, res) => {
  const db1=req.ret_db
  const Mat_rate_setup = db1.mat_rate_setup;

  const mat_id = req.params.id;
  Mat_rate_setup.findAll({
    where:{ material_id:mat_id, status:1 },
    attributes: ['mat_current_rate']
  })
    .then((data) => {
      if(!data)
        {
           res.status(500).send({
                   message: "Sorry! Data Not Found With Id=" + mat_id,
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Material Rate with id=" + mat_id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Mat_rate_setup = db1.mat_rate_setup;

  const id = req.params.id;
  Mat_rate_setup.update(req.body, {
    where: { mat_rate_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Material Rate was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Material Rate with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Mat_rate_setup = db1.mat_rate_setup;

  const id = req.params.id;
  Mat_rate_setup.destroy({
    where: { mat_rate_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Material Rate was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Material Rate with id=${id}`,
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
  const Mat_rate_setup = db1.mat_rate_setup;

    Mat_rate_setup.findAll({
      include: [
        {
          model: db.raw_material,
          as: 'mat'
    
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
        message: err.message || "Some error occured while retrieving Material Rate",
      });
    });
};



