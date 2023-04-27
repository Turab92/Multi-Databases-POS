const db = require("../../central/models/user");
const Retailer = db.retailer;
const Raw_material = db.raw_material;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createRMD': {
     return [ 
        body('mat_mas_id', 'Master Material is required').notEmpty(),
        body('mat_mas_id', 'Master Material value must be in integer').isInt(),
        body('mat_receipe', 'Raw Receipe is required').isArray({ min: 1}),
        // body('material_id', 'Material is required').notEmpty(),
        // body('material_id', 'Material value must be in integer').isInt(),
        // body('mat_det_uom', 'Material detail UOM is required').notEmpty(),
        // body('mat_det_uom', 'Material detail UOM value must be in integer').isFloat(),
        // body('mat_det_rate', 'Material rate value must be in integer').optional().isFloat().if(body('mat_det_rate').exists()),
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

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Raw_mat_det = db1.raw_mat_det;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    try {
        var arr = [];
        var details= JSON.parse(JSON.stringify(req.body.mat_receipe))
        for(sub_det of details)
        {
          const raw_mat_det = {
            mat_mas_id: req.body.mat_mas_id,
            material_id: sub_det.material_id,
            mat_det_uom: sub_det.mat_det_uom,
            mat_det_rate: sub_det.mat_det_rate,
            status:'1',
          };
            if(req.body.mat_mas_id == sub_det.material_id)
            {
                  var obj = {
                    material: sub_det.material_id,
                    status:"Error",
                    message:"Sorry! Material and Master Material couldn't be same.",
                  };
                  arr.push(obj);
            }
            else
            {
            var data = await Raw_mat_det.findAll({
                  where: {
                      mat_mas_id:req.body.mat_mas_id,
                      material_id:sub_det.material_id
                    },
                    include: [
                      {
                        model: db.raw_material,
                        as: 'raw_det_mas',
                      },
                      {
                        model: db.raw_material,
                        as: 'raw_det_mat',
                      },
                    ]
              })
                  if(!data.length)
                  {
                  var data_add= await Raw_mat_det.create(raw_mat_det)
                  var data2 = await Raw_material.findAll({
                    where: {
                      material_id:sub_det.material_id
                    }
                  })
                    var obj = {
                      material: sub_det.material_id,
                      status:"Success",
                      message:`${data2[0].dataValues.material_name} insert successfully`,
                    };
                    arr.push(obj);
                  
                  }
                  else
                  {
                      var obj = {
                        material: sub_det.material_id,
                        status:"Error",
                        message:`Sorry ${data[0].dataValues.raw_det_mat.material_name} already exist on behalf of this ${data[0].dataValues.raw_det_mas.material_name}`,
                      };
                      arr.push(obj);
                  }
              
            }
        }
          res.status(200).send(arr);
    }
    catch (error)
    {
      res.status(500).send(error);
    }     
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_det = db1.raw_mat_det;

    Raw_mat_det.findAll({
      include: [
        {
          model: db.raw_material,
          as: 'raw_det_mas'
    
        },
        {
          model: db.raw_material,
          as: 'raw_det_mat',
          include: [
            {
              model: db.uom,
              as: 'uom'
            }
          ]
    
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
  const Raw_mat_det = db1.raw_mat_det;

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
  const db1=req.ret_db
  const Raw_mat_det = db1.raw_mat_det;

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
  const db1=req.ret_db
  const Raw_mat_det = db1.raw_mat_det;

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
  const Raw_mat_det = db1.raw_mat_det;

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
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};
