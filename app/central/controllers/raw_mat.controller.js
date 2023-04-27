const db = require("../models/user");
const Raw_material = db.raw_material;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createRM': {
     return [ 
          body('material_name', 'Material name is required').notEmpty(),
          body('uom_id', 'UOM is required').notEmpty(),
          body('uom_id', 'UOM value must be in integer').isInt(),
          body('material_uom', 'Material UOM is required').notEmpty(),
          body('material_uom', 'Material UOM value must be in integer').isInt(),
          body('allow_vendor', 'Allow Vendor is required').notEmpty(),
          body('allow_vendor', 'Allow Vendor value must be in integer').isInt(),
          
       ]   
    }
    case 'updateRM': {
      return [ 
          body('material_name', 'Material name is required').notEmpty(),
          body('uom_id', 'UOM is required').notEmpty(),
          body('uom_id', 'UOM value must be in integer').isInt(),
          body('material_uom', 'Material UOM is required').notEmpty(),
          body('material_uom', 'Material UOM value must be in integer').isInt(),
          body('allow_vendor', 'Allow Vendor is required').notEmpty(),
          body('allow_vendor', 'Allow Vendor value must be in integer').isInt(),
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
   if (req.file == undefined) {
        res.status(400).send({
          message: "Material image can not be empty !",
        });
        return;
      }
      
        else{
        
              var path = req.protocol+ '://' + req.get('Host') + '/public/material_image/' + req.file.filename;
            
              const raw_material = {
                material_name: req.body.material_name,
                material_image: path,
                uom_id: req.body.uom_id,
                material_uom: req.body.material_uom,
                material_rate: req.body.material_rate,
                sku_code: req.body.sku_code,
                allow_vendor:req.body.allow_vendor,
                retailer_id:req.body.retailer_id,
                status:'1',
              };
              Raw_material.findAll({
                where: Sequelize.where(
                  Sequelize.fn('lower', Sequelize.col('material_name')), 
                  Sequelize.fn('lower', req.body.material_name)
                )
              })
                .then((data) => {
                  if(!data.length)
                    {
                      Raw_material.create(raw_material)
                      .then((data) => {
                      res.status(200).send(data);
                      })
                      .catch((err) => {
                        res.status(500).send({
                          message: err.message || "Some error occurred while create the Raw Material. Error: ",err,
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
      
  }
};

exports.RetailerMaterial = (req, res) => {
  Raw_material.findAll({
    where:{
      [Op.or]:
      [
          {
            retailer_id:null,
          },
          {
            retailer_id:req.params.retailer_id
          }
      ],
      status:1
    }
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


exports.findAll = (req, res) => {
    Raw_material.findAll({
      where:{status:1},
      include: [
          {
            model: db.uom,
            as: 'uom'
          },
          {
            model: db.retailer,
            as: 'retailer_raw'
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

exports.findAllData = (req, res) => {
  Raw_material.findAll({
    include: [
        {
          model: db.uom,
          as: 'uom'
        },
        {
          model: db.retailer,
          as: 'retailer_raw'
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

exports.findBranchRaw = (req, res) => {
  Raw_material.findAll({
    where:{status:1,allow_vendor:1},
    include: [
        {
          model: db.uom,
          as: 'uom'
        },
        {
          model: db.retailer,
          as: 'retailer_raw'
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

exports.findOne = (req, res) => {
  const id = req.params.id;
  Raw_material.findByPk(id,{
    include: [
        {
          model: db.uom,
          as: 'uom'
        },
        {
          model: db.retailer,
          as: 'retailer_raw'
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
        message: "Error retrieving Raw Material with id=" + id,
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
            
      if (req.file == undefined) {
      
        Raw_material.update(req.body, {
          where: { material_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Raw Material was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Raw Material with id=${id}`,
            });
          }
        });
      }
    
      else{
        
          var path = req.protocol+ '://' + req.get('Host') + '/public/material_image/' + req.file.filename;
      
          const raw_material = {
            material_name: req.body.material_name,
            material_image: path,
            uom_id: req.body.uom_id,
            material_uom: req.body.material_uom,
            material_rate: req.body.material_rate,
            allow_vendor:req.body.allow_vendor,
            retailer_id:req.body.retailer_id,
            status:req.body.status,
          };
        
          Raw_material.update(raw_material, {
            where: { material_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Raw Material was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Raw Material with id=${id}`,
              });
            }
          });
          } 
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Raw_material.destroy({
    where: { material_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Raw Material was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Raw Material with id=${id}`,
      });
    }
  });
};

exports.findMat = (req, res) => {
  const name= req.params.name;
  Raw_material.findAll({
    where: { 
      material_name: {
        [Op.iLike]: `%${name}%`
      },
      status:1
    },
    
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
        message: "Error retrieving material ",
      });
    });
};
