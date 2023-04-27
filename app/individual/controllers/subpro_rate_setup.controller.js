const db = require("../../central/models/user");
const Retailer =db.retailer
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createSPR': {
     return [ 
        body('sub_pro_id', 'Sub Product is required').notEmpty(),
        body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
        body('est_rate', 'Est Rate is required').notEmpty(),
        body('est_rate', 'Est Rate value must be in integer').isFloat(),
        body('net_rate', 'Net Rate is required').notEmpty(),
        body('net_rate', 'Net Rate value must be in integer').isFloat(),
        body('discount', 'Discount value must be in integer').isFloat(),
       ]   
    }
    case 'updateSPR': {
      return [ 
         body('sub_pro_id', 'Sub Product is required').notEmpty(),
         body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
         body('est_rate', 'Est Rate is required').notEmpty(),
         body('est_rate', 'Est Rate value must be in integer').isFloat(),
         body('net_rate', 'Net Rate is required').notEmpty(),
         body('net_rate', 'Net Rate value must be in integer').isFloat(),
         body('discount', 'Discount value must be in integer').isFloat(),
         body('status', 'status is required').notEmpty(),
         body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}
exports.create = (req, res) => {
  const db1=req.ret_db
  const Subpro_rate_setup = db1.subpro_rate_setup;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    const subpro_rate_setup = {
    sub_pro_id: req.body.sub_pro_id,
    est_rate: req.body.est_rate,
    net_rate: req.body.net_rate,
    discount: req.body.discount,
    status:'1',
    };
    Subpro_rate_setup.findAll({
    where:{
        sub_pro_id: req.body.sub_pro_id,
    }
    })
    .then((data1) => {
    if(!data1.length)
    {
        Subpro_rate_setup.create(subpro_rate_setup)
        .then((data) => {
        res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send({
            message: err.message || "Some error occurred while create the Raw Material",
            });
        });
    }
    else
    {
        Subpro_rate_setup.update({status:0}, {
            where: { sub_pro_id: req.body.sub_pro_id },
            }).then((data) => {
            if (data[0] != 0) {

                Subpro_rate_setup.create(subpro_rate_setup)
                .then((data) => {
                res.status(200).send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while create the Raw Material",
                    });
                });

            } else {
                res.status(500).send({
                message: `Cannot update Raw Material with id=${req.body.sub_pro_id}`,
                });
            }
            });
    }
    })
    .catch((err) => {
    res.status(500).send({
        message: "Error retrieving Raw Material with id=" + req.body.sub_pro_id,
    });
    });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Subpro_rate_setup = db1.subpro_rate_setup;

    Subpro_rate_setup.findAll({
      include: [
        {
          model: db1.sub_products,
          as: 'subpro_rate',
    
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
  const db1=req.ret_db
  const Subpro_rate_setup = db1.subpro_rate_setup;

  const id = req.params.id;
  Subpro_rate_setup.findByPk(id,{
    include: [
      {
        model: db1.sub_products,
        as: 'subpro_rate',
  
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
  const db1=req.ret_db
  const Subpro_rate_setup = db1.subpro_rate_setup;

  const id = req.params.id;
  Subpro_rate_setup.findAll({
    where:{
      sub_pro_id: req.body.sub_pro_id,
    }
  })
  .then((data1) => {
        if(!data1.length)
        {
          const subpro_rate_setup = {
            material_id: req.body.material_id,
            unit_or_weight: req.body.unit_or_weight,
            status:req.body.status,
          };
          Subpro_rate_setup.update(subpro_rate_setup, {
            where: { sp_rate_id: id },
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
          const subpro_rate_setup = {
            unit_or_weight: req.body.unit_or_weight,
            status:req.body.status,
          };
          Subpro_rate_setup.update(subpro_rate_setup, {
            where: { sp_rate_id: id },
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
    });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Subpro_rate_setup = db1.subpro_rate_setup;

  const id = req.params.id;
  Subpro_rate_setup.destroy({
    where: { sp_rate_id: id },
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

exports.EstPrice = async (req, res) => {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;
  const Br_grn_det = db1.br_grn_det;

    var data1 = await  Product_cost.findAll({
      where:{sub_pro_id:req.params.sub_pro_id},
      include: [
        {
          model: db.raw_material,
          as: 'raw_mat_cost'
        }  
      ]
    });
  
      if(!data1.length)
      {
        res.status(203).send({
          message: "Data Not Found",
         });
      }
      else
      {
        var sum = 0;
        var arr=[];
        for(var det of data1)
        {
            var data = await  Br_grn_det.findAll({
            where : {material_id:det.dataValues.material_id,status:1},
            attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty',],[sequelize.literal(
              `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )` ),`pr`]  ,
            
            ],
          });
            if(!data.length)
            {
              res.status(500).send({
                      message: "Data Not Found",
                  });
            }
            else
            {
              sum += parseFloat(det.dataValues.unit_or_weight*data[0].dataValues.pr);
              if(data[0].dataValues.pr == null){
                var obj = {
                    materialname:  det.dataValues.raw_mat_cost.material_name
                  };
                   arr.push(obj)
                }
            }
  
        }
        return res.status(200).send({"Est_Rate":sum,"data":arr});
      }
  };
  
exports.SPRateReport = async (req, res) => {
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
  const Subpro_rate_setup = db1.subpro_rate_setup;

    if(req.body.sub_pro_id==undefined || req.body.sub_pro_id=='')
    {
      res.status(422).send({
        message: "Sub Product cannot be null",
      });
    }
    else
    {
      if(req.body.start != '' && req.body.end != '' && req.body.sub_pro_id=='All')
      {
        startdate=req.body.start+' 00:00:00.00 +00:00'
        enddate=req.body.end+' 23:59:59.00 +00:00'
        check = 
        {
          createdAt: 
          {
            [Op.between]: [startdate,enddate] 
          },
        }
      }
      else if(req.body.start != '' && req.body.end != '' && req.body.sub_pro_id !='All')
      {
        startdate=req.body.start+' 00:00:00.00 +00:00'
        enddate=req.body.end+' 23:59:59.00 +00:00'
        check = 
        {
          createdAt: 
          {
            [Op.between]: [startdate,enddate],
            
          },
          sub_pro_id:req.body.sub_pro_id
        }
      }
      else if(req.body.sub_pro_id !='All')
      {
        check = 
        {
          sub_pro_id:req.body.sub_pro_id
        }
      }
      else{
        check={}
      }
          var data1 = await  Subpro_rate_setup.findAll({
              where:check,
              include: [
                {
                  model: db1.sub_products,
                  as: 'subpro_rate',
                  attributes:['sub_pro_id','sub_pro_name']
                }  
              ]
            });
        
          if(!data1.length)
          {
            res.status(422).send({
                    message: "No detail found",
                });
          }
          else
          {
            res.status(200).send(data1);
          }
    
    }
  };

  exports.findAllDB = async (req, res) => {
    var ret_id = parseInt(req.body.retailer_id)
    var retailer = await Retailer.findByPk(ret_id)
    if(!retailer)
      {
         res.status(500).send({
                 message: "Sorry! Data Not Found With Id=" + ret_id,
            });
      }
      else
      {
        const ret_db = require("../../individual/models/user");
        req.cur_ret_db=ret_db.getdb(retailer.dataValues.retailer_unique_no)
      }
    const db1=req.cur_ret_db
    const Subpro_rate_setup = db1.subpro_rate_setup;
  
      Subpro_rate_setup.findAll({
        where:{sub_pro_id:req.body.sub_pro_id},
        include: [
          {
            model: db1.sub_products,
            as: 'subpro_rate',
      
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