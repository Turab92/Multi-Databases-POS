const db = require("../models/user");
const Raw_mat_det = db.raw_mat_det;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createRMD': {
     return [ 
        body('mat_mas_id', 'Master Material is required').notEmpty(),
        body('mat_mas_id', 'Master Material value must be in integer').isInt(),
        body('material_id', 'Material is required').notEmpty(),
        body('material_id', 'Material value must be in integer').isInt(),
        body('mat_det_uom', 'Material detail UOM is required').notEmpty(),
        body('mat_det_uom', 'Material detail UOM value must be in integer').isFloat(),
        body('mat_det_rate', 'Material rate value must be in integer').optional().isFloat().if(body('mat_det_rate').exists()),
       ]

    }
    case 'updateRMD': {
        return [ 
           body('mat_mas_id', 'Master Material is required').notEmpty(),
           body('mat_mas_id', 'Master Material value must be in integer').isInt(),
           body('material_id', 'Material is required').notEmpty(),
           body('material_id', 'Material value must be in integer').isInt(),
           body('mat_det_uom', 'Material detail UOM is required').notEmpty(),
           body('mat_det_uom', 'Material detail UOM value must be in integer').isFloat(),
           body('status', 'Status is required').notEmpty(),
           body('status', 'Status value must be in integer').isInt(),
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

      const raw_mat_det = {
        mat_mas_id: req.body.mat_mas_id,
        material_id: req.body.material_id,
        mat_det_uom: req.body.mat_det_uom,
        mat_det_rate: req.body.mat_det_rate,
        status:'1',
      };
    if(req.body.mat_mas_id == req.body.material_id)
    {
        res.status(421).send({
            message:"Sorry! Material and Master Material couldn't be same.",
          });
    }
    else
    {
      Raw_mat_det.findAll({
          where: {
              mat_mas_id:req.body.mat_mas_id,
              material_id:req.body.material_id
            }
      })
        .then((data) => {
          if(!data.length)
          {
            Raw_mat_det.create(raw_mat_det)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:"Some error occurred while create the Material Rate",
              });
            });
          }
          else
          {
            res.status(422).send({
                message:"Sorry material already exist on behalf of this master material",
              });
          }
        })
        .catch((err) => {
          res.status(502).send({
            message: err.message || "Some error occured while retrieving Material Rate",
          });
        });
    }
  }
};

exports.findAll = (req, res) => {
    Raw_mat_det.findAll({
      include: [
        {
          model: db.raw_material,
          as: 'raw_det_mas'
    
        },
        {
          model: db.raw_material,
          as: 'raw_det_mat'
    
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
  Raw_mat_det.findByPk(id,{
    include: [
      {
        model: db.raw_material,
        as: 'raw_det_mas'
  
      },
      {
        model: db.raw_material,
        as: 'raw_det_mat'
  
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
        message: "Error retrieving Material detail with id=" + id,
      });
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  if(req.body.mat_mas_id == req.body.material_id)
  {
      res.status(421).send({
          message:"Sorry! Material and Master Material couldn't be same.",
        });
  }
  else
  {
    Raw_mat_det.findAll({
        where: {
            mat_mas_id:req.body.mat_mas_id,
            material_id:req.body.material_id
          }
    })
      .then((data) => {
        if(!data.length)
        {
          const raw_mat_det = {
            material_id: req.body.material_id,
            mat_det_uom: req.body.mat_det_uom,
            mat_det_rate: req.body.mat_det_rate,
            status:req.body.status,
          };
          Raw_mat_det.update(raw_mat_det, {
            where: { mat_det_id: id },
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
        }
        else
        {
          const raw_mat_det = {
            mat_det_uom: req.body.mat_det_uom,
            mat_det_rate: req.body.mat_det_rate,
            status:req.body.status,
          };
          Raw_mat_det.update(raw_mat_det, {
            where: { mat_det_id: id },
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
        }
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving Material Rate",
        });
      });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Raw_mat_det.destroy({
    where: { mat_det_id: id },
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


