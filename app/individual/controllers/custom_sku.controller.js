const db = require("../../central/models/user");
const Retailer = db.retailer;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createCSKU': {
     return [ 
          body('cus_sku_name', 'Cutom SKU name is required').notEmpty(),
          body('uom_id', 'UOM is required').notEmpty(),
          body('uom_id', 'UOM value must be in integer').isInt(),
          body('cus_sku_uom', 'Cutom SKU UOM is required').notEmpty(),
          body('cus_sku_uom', 'Cutom SKU UOM value must be in integer').isInt(),
       ]   
    }
    case 'updateCSKU': {
      return [ 
          body('cus_sku_name', 'Cutom SKU name is required').notEmpty(),
          body('uom_id', 'UOM is required').notEmpty(),
          body('uom_id', 'UOM value must be in integer').isInt(),
          body('cus_sku_uom', 'Cutom SKU UOM is required').notEmpty(),
          body('cus_sku_uom', 'Cutom SKU UOM value must be in integer').isInt(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
 const db1=req.ret_db
 const Custom_sku = db1.custom_sku;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  { 
   if (req.file == undefined) {
        res.status(400).send({
          message: "Custom Sku image can not be empty !",
        });
        return;
      }
      
        else{
        
              var path = req.protocol+ '://' + req.get('Host') + '/public/custom_sku_image/' + req.file.filename;
            
              const custom_sku = {
                cus_sku_name: req.body.cus_sku_name,
                cus_sku_image: path,
                uom_id: req.body.uom_id,
                cus_sku_uom: req.body.cus_sku_uom,
                cus_sku_rate: req.body.cus_sku_rate,
                is_approved: 0,
                status:'1',
              };
              Custom_sku.findAll({
                where: Sequelize.where(
                  Sequelize.fn('lower', Sequelize.col('cus_sku_name')), 
                  Sequelize.fn('lower', req.body.cus_sku_name)
                )
              })
                .then((data) => {
                  if(!data.length)
                    {
                      Custom_sku.create(custom_sku)
                      .then((data) => {
                      res.status(200).send(data);
                      })
                      .catch((err) => {
                        res.status(500).send({
                          message: err.message || "Some error occurred while create the Custom SKU",
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

exports.findAll = (req, res) => {
    const db1=req.ret_db
    const Custom_sku = db1.custom_sku;

    Custom_sku.findAll({
      where:{status:1},
      include: [
          {
            model: db.uom,
            as: 'custom_uom'
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
        message: err.message || "Some error occured while retrieving Custom SKU",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Custom_sku = db1.custom_sku;

  Custom_sku.findAll({
    include: [
        {
          model: db.uom,
          as: 'custom_uom'
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
      message: err.message || "Some error occured while retrieving Custom SKU",
    });
  });
};

exports.findRetailerData = async (req, res) => {
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
  const Custom_sku = db1.custom_sku;

  Custom_sku.findAll({
    include: [
        {
          model: db.uom,
          as: 'custom_uom'
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
      message: err.message || "Some error occured while retrieving Custom SKU",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Custom_sku = db1.custom_sku;

  const id = req.params.id;
  Custom_sku.findByPk(id,{
    include: [
        {
          model: db.uom,
          as: 'custom_uom'
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
        message: "Error retrieving Custom SKU with id=" + id,
      });
    });
};

exports.retailer_approval = async (req, res) => {
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
  const Custom_sku = db1.custom_sku;

  const id = req.params.cus_sku_id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {   
        Custom_sku.update(req.body, {
          where: { cus_sku_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Custom SKU was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Custom SKU with id=${id}`,
            });
          }
        });
  }
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Custom_sku = db1.custom_sku;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
            
      if (req.file == undefined) {
      
        Custom_sku.update(req.body, {
          where: { cus_sku_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Custom SKU was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Custom SKU with id=${id}`,
            });
          }
        });
      }
    
      else{
        
          var path = req.protocol+ '://' + req.get('Host') + '/public/custom_sku_image/' + req.file.filename;
      
          const custom_sku = {
            cus_sku_name: req.body.cus_sku_name,
            cus_sku_image: path,
            uom_id: req.body.uom_id,
            cus_sku_uom: req.body.cus_sku_uom,
            cus_sku_rate: req.body.cus_sku_rate,
            is_approved:req.body.is_approved,
            status:req.body.status,
          };
        
          Custom_sku.update(custom_sku, {
            where: { cus_sku_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Custom SKU was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Custom SKU with id=${id}`,
              });
            }
          });
          } 
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Custom_sku = db1.custom_sku;

  const id = req.params.id;

  Custom_sku.destroy({
    where: { cus_sku_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Custom SKU was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Custom SKU with id=${id}`,
      });
    }
  });
};
