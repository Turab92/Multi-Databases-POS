const db = require("../../central/models/user");
const Retailer = db.retailer;
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const dbConfig = require("../../confiq/db.config");

const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDS': {
     return [ 
        body('ds_name', 'Deal setup name is required').notEmpty(),
        body('dp_id', 'deal provider is required').notEmpty(),
        body('dp_id', 'deal provider value must be in integer').isInt(),
        body('price', 'Price is required').notEmpty(),
        body('price', 'Price value must be in integer').isFloat(),
        body('is_combo', 'Is combo is required').notEmpty(),
        body('is_combo', 'Is combo value must be in integer').isInt(),
       ]   
    }
    case 'updateDS': {
      return [ 
          body('ds_name', 'Deal setup name is required').notEmpty(),
          body('dp_id', 'deal provider is required').notEmpty(),
          body('dp_id', 'deal provider value must be in integer').isInt(),
          body('price', 'Price is required').notEmpty(),
          body('price', 'Price value must be in integer').isInt(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
          body('is_combo', 'Is combo is required').notEmpty(),
          body('is_combo', 'Is combo value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

   // Finds the validation errors in this request and wraps them in an object with handy functions
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     res.status(422).json({ errors: errors.array() });
     return;
   }
   else
   {        
          if (req.file == undefined) {
            res.status(400).send({
              message: "Deal image can not be empty !",
            });
            return;
          }
          
            else{
             
             
                  var path = req.protocol+ '://' + req.get('Host') + '/public/Deal_image/' + req.file.filename;
                
                  const deal_setup = {
                    ds_name: req.body.ds_name,
                    ds_desc: req.body.ds_desc,
                    dp_id: req.body.dp_id,
                    price: req.body.price,
                    is_combo: req.body.is_combo,
                    ds_img: path,
                    status:'1',
                  };
                  Deal_setup.findAll({
                    where: Sequelize.where(
                      Sequelize.fn('lower', Sequelize.col('ds_name')), 
                      Sequelize.fn('lower', req.body.ds_name)
                    )
                  })
                    .then((data) => {
                      if(!data.length)
                        {
                          Deal_setup.create(deal_setup)
                          .then((data) => {
                          res.status(200).send(data);
                          })
                          .catch((err) => {
                            res.status(500).send({
                              message: err.message || "Some error occurred while create the Deal setup",
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
  const Deal_setup = db1.deal_setup;

    Deal_setup.findAll({
      where:{status:1},
      include: [
          {
            model: db1.deal_provider,
            as: 'dp'
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
        message: err.message || "Some error occured while retrieving Deal setup",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

  Deal_setup.findAll({
    include: [
        {
          model: db1.deal_provider,
          as: 'dp'
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
      message: err.message || "Some error occured while retrieving Deal setup",
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
  const Deal_setup = db1.deal_setup;

  Deal_setup.findAll({
    include: [
        {
          model: db1.deal_provider,
          as: 'dp'
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
      message: err.message || "Some error occured while retrieving Deal setup",
    });
  });
};

exports.findAllActive = async (req, res) => {
  const deptid = req.params.deptid;

  const sequelize = new Sequelize(req.ret_dbname, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: 0,
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  });
  
  const result = await sequelize.query(`SELECT distinct(ds.*),dp.dp_name FROM deal_setups as ds,deal_items as dt,branch_products as bp,deal_providers as dp where bp.dept_id=${deptid} and bp.status=1 and bp.sub_pro_id=dt.sub_pro_id and ds.ds_id=dt.ds_id and ds.dp_id=dp.dp_id and dp.web_app_status=1`, { type: QueryTypes.SELECT });
  
  if(!result.length)
  {
     res.status(500).send({
             message: "Sorry! Data Not Found With Id=" + deptid,
        });
      
  }
  else
  {
     res.status(200).send(result);
  }
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

  const id = req.params.id;
  Deal_setup.findByPk(id)
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
        message: "Error retrieving Deal setup with id=" + id,
      });
    });
};
exports.findPro = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

  const id = req.params.id;
  Deal_setup.findAll({
    where: { dp_id: id,status:1 },
    
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
        message: "Error retrieving Deal with Provider id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {   
      if (req.file == undefined) {
      
        Deal_setup.update(req.body, {
          where: { ds_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Deal setup was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Deal setup with id=${id}`,
            });
          }
        });
      }
    
      else{
        
          var path = req.protocol+ '://' + req.get('Host') + '/public/Deal_image/' + req.file.filename;
        
          
        
          const deal_setup = {
            ds_name: req.body.ds_name,
            ds_desc: req.body.ds_desc,
            dp_id: req.body.dp_id,
            price: req.body.price,
            ds_img: path,
            is_combo: req.body.is_combo,
            status:req.body.status,
          };
        
          Deal_setup.update(deal_setup, {
            where: { ds_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Deal setup was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Deal setup with id=${id}`,
              });
            }
          });
          }
          
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

  const id = req.params.id;
  Deal_setup.destroy({
    where: { ds_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Deal setup was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Deal setup with id=${id}`,
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
  const Deal_setup = db1.deal_setup;

  Deal_setup.findAll({
    include: [
        {
          model: db1.deal_provider,
          as: 'dp'
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
      message: err.message || "Some error occured while retrieving Deal setup",
    });
  });
};

exports.deal_items = (req, res) => {
  const db1=req.ret_db
  const Deal_setup = db1.deal_setup;

  Deal_setup.findAll({
    where:{status:1},
    include: [
        {
          model: db1.deal_item,
          as: 'ds',
          where:{status:1}
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
      message: err.message || "Some error occured while retrieving Deal setup",
    });
  });
};