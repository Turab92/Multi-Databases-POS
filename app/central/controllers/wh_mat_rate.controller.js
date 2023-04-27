const db = require("../models/user");
const Wh_mat_rate = db.wh_mat_rate;
const Wh_grn_det = db.wh_grn_det;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createWMR': {
     return [ 
        body('dept_id', 'Department is required').notEmpty(),
        body('dept_id', 'Department value must be in integer').isInt(),
        body('material_id', 'Material is required').notEmpty(),
        body('material_id', 'Material value must be in integer').isInt(),
        body('mat_current_rate', 'Material Current Rate is required').notEmpty(),
        body('mat_current_rate', 'Material Current Rate value must be in integer').isFloat(),
        body('mat_set_profit_rate', 'Material Profit Rate is required').notEmpty(),
        body('mat_set_profit_rate', 'Material Profit Rate value must be in integer').isFloat(),
        body('user_id', 'User id is required').notEmpty(),
        body('user_id', 'User id value must be in integer').isInt(),
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

      const wh_mat_rate = {
        dept_id: req.body.dept_id,
        material_id: req.body.material_id,
        mat_current_rate: req.body.mat_current_rate,
        mat_set_profit_rate: req.body.mat_set_profit_rate,
        user_id: req.body.user_id,
        status:'1',
      };

      Wh_mat_rate.findAll({
          where: {dept_id:req.body.dept_id, material_id:req.body.material_id}
      })
        .then((data) => {
          if(!data.length)
          {
            Wh_mat_rate.create(wh_mat_rate)
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
            const wh_rate_update = {
                status:'0',
              };
            Wh_mat_rate.update(wh_rate_update, {
                where: {dept_id:req.body.dept_id, material_id:req.body.material_id },
              }).then((data) => {
                if (data[0] != 0) {
                    Wh_mat_rate.create(wh_mat_rate)
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
                    message: `Cannot update Material with id=${req.body.material_id }`,
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
    Wh_mat_rate.findAll({
      include: [
        {
          model: db.department_setup,
          as: 'wh_rate_dept'
        },
        {
          model: db.raw_material,
          as: 'wh_raw_rate'
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
  const id = req.params.id;
  Wh_mat_rate.findByPk(id,{
    include: [
        {
            model: db.department_setup,
            as: 'wh_rate_dept'
        },
        {
            model: db.raw_material,
            as: 'wh_raw_rate'
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
  const dept_id = req.params.deptid;
  const mat_id = req.params.matid;
  Wh_mat_rate.findAll({
    where:{ dept_id:dept_id,material_id:mat_id, status:1 },
    attributes: ['mat_set_profit_rate']
  })
    .then((data) => {
      if(!data.length)
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

exports.findAllRate = (req, res) => {
    const dept_id = req.params.deptid;
    Wh_mat_rate.findAll({
      where:{ dept_id:dept_id, status:1 },
      include: [
        {
          model: db.department_setup,
          as: 'wh_rate_dept'
        },
        {
          model: db.raw_material,
          as: 'wh_raw_rate'
        }
      ]
    })
      .then((data) => {
        if(!data.length)
          {
             res.status(500).send({
                     message: "Sorry! Data Not Found With Id=" + dept_id,
                });
          }
          else
          {
             res.status(200).send(data);
          }
      })
      .catch((err) => {
        res.status(502).send({
          message: "Error retrieving Material Rate with id=" + dept_id,
        });
      });
  };

exports.update = (req, res) => {
  const id = req.params.id;

  Wh_mat_rate.update(req.body, {
    where: { wh_mat_rate_id: id },
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
  const id = req.params.id;

  Wh_mat_rate.destroy({
    where: { wh_mat_rate_id: id },
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

exports.findStockRate = (req, res) => {
    const matid = req.params.mat_id;
    const deptid = req.params.dept_id;
    Wh_grn_det.findAll({
      limit: 1,
      where:{ dept_id:deptid,material_id:matid,status:1 },
      attributes: ['price'],
      order: [ [ 'wh_grn_did', 'DESC' ]]
    })
      .then((data) => {
        if(!data.length)
          {
             res.status(500).send({
                     message: "Sorry! Data Not Found With Id=" + matid,
                });
          }
          else
          {
             res.status(200).send(data);
          }
      })
      .catch((err) => {
        res.status(502).send({
          message: "Error retrieving Material Rate with id=" + matid,
        });
      });
  };

