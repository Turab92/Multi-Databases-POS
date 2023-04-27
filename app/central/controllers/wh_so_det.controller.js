const db = require("../models/user");
const Wh_so_det = db.wh_so_det;
const Wh_grn_det = db.wh_grn_det;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const dbConfig = require("../../confiq/db.config");

exports.create = (req, res) => {
  if (!req.body.wh_so_mid) {
    res.status(400).send({
      message: "Order Master id can not be empty !",
    });
    return;
  }

  const wh_so_det = {
    wh_so_mid: req.body.wh_so_mid,
    material_id: req.body.material_id,
    price: req.body.price,
    req_unit_qty: req.body.req_unit_qty,
    so_unit_qty: req.body.so_unit_qty,
    total_amount: req.body.price * req.body.so_unit_qty,
    par_dept_id: req.body.par_dept_id,
    status:'0',
  };
  if(req.body.so_unit_qty > req.body.avl_qty || req.body.so_unit_qty > req.body.req_unit_qty)
  {
    res.status(409).send({
      message: "Order Quantity is greater than Requested Quantity or Available Quantity"
     });
  }
  else 
  {
  
    Wh_so_det.findAll({
      where:{
        wh_so_mid: req.body.wh_so_mid,
        material_id: req.body.material_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          
          Wh_so_det.create(wh_so_det)
          .then((data) => {
           res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Sale Order Detail",
            });
          });
        }
        else
        {
          res.status(409).send({
            message: "Material Already Exist with this Sale Order Master id"+req.body.wh_so_mid,
           });
        }
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving Sale Order Detail",
        });
      });
    }
};

exports.findAll = (req, res) => {
    Wh_so_det.findAll()
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
        message: err.message || "Some error occured while retrieving Purchase Order Detail",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Wh_so_det.findByPk(id)
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
        message: "Error retrieving Purchase Order Detail with id=" + id,
      });
    });
};

exports.findMas = (req, res) => {
  const mas_id = req.params.mas_id;
  Wh_so_det.findAll({
    where: {wh_so_mid:mas_id},
    
      include: [
        {
          model: db.raw_material,
          as: 'so_mat'
    
        }
      ]
    
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(204).send({
                   message: "Sorry! Data Not Found With Id=" + mas_id,
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Sale Order Detail with id=" + mas_id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Wh_so_det.update(req.body, {
    where: { wh_so_mid: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Purchase Order Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Purchase Order Detail with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Wh_so_det.destroy({
    where: { wh_so_did: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Purchase Order Detail was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Purchase Order Detail with id=${id}`,
      });
    }
  });
};

exports.EstPrice = async (req, res) => {
  
        var data = await  Wh_grn_det.findAll({
        where : {material_id:req.params.material_id,dept_id:req.params.dept_id,status:1},
        attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],[sequelize.literal(
          `(Select price from wh_grn_details where wh_grn_details."material_id"=${req.params.material_id} and "wh_grn_details"."dept_id"=${req.params.dept_id} and wh_grn_details.status=1 ORDER BY wh_grn_details.wh_grn_did DESC LIMIT 1 )` ),`pr`],
       ],
      });
        return  res.status(200).send({"Retail_Rate":data[0].dataValues.pr});
          
};

exports.RawSaleReport = async (req, res) => {
  if(req.body.material_id==undefined || req.body.dept_id==undefined || req.body.material_id=='' || req.body.dept_id=='')
  {
    res.status(422).send({
      message: "Department or material cannot be null",
    });
  }
  else
  {
    if(req.body.start != '' && req.body.end != '')
      {
        startdate=req.body.start+' 00:00:00.00 +00:00'
        enddate=req.body.end+' 23:59:59.00 +00:00'
        check = 
        {
          createdAt: 
          {
            [Op.between]: [startdate,enddate] 
          
          },
          par_dept_id:req.body.dept_id,
          material_id:req.body.material_id,
          status:1 
        }
      }
      else
      {
        check = 
        {
          par_dept_id:req.body.dept_id,
          material_id:req.body.material_id,
          status:1 
        }
      }
    Wh_so_det.findAll({
      where: check,
        include: [
          {
            model: db.raw_material,
            as: 'so_mat',
            include: [
              {
                model: db.uom,
                as: 'uom'
              }
            ]
      
          },
          {
            model: db.department_setup,
            as: 'wh_so_det_dept',
            
          }
        ]
      
    })
      .then((data) => {
        if(!data.length)
          {
             res.status(422).send({
                     message: "Sorry! Data Not Found",
                });
          }
          else
          {
             res.status(200).send(data);
          }
      })
      .catch((err) => {
        res.status(502).send({
          message: "Error retrieving Sale Order Detail",
        });
      });
  }
};

exports.mat_sale_graph = async (req, res) => {
  const deptid = req.body.dept_id;

  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
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

      if(req.body.dept_id== '')
      {
        query=`Select Sum(so_unit_qty),raw_materials.material_id,raw_materials.material_name,to_char(date("wh_so_details"."createdAt"),'YYYY-MM') as year_month from wh_so_details, raw_materials where wh_so_details.status=1
        and wh_so_details.material_id=raw_materials.material_id
        GROUP BY year_month,raw_materials.material_id
        ORDER By raw_materials.material_id`;
      }
      else
      {
        query=`Select Sum(so_unit_qty),raw_materials.material_id,raw_materials.material_name,to_char(date("wh_so_details"."createdAt"),'YYYY-MM') as year_month from wh_so_details, raw_materials where wh_so_details.status=1
        and wh_so_details.material_id=raw_materials.material_id
        and wh_so_details.par_dept_id=${deptid}
        GROUP BY year_month,raw_materials.material_id
        ORDER By raw_materials.material_id`;
      }
      
      
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      
      if(!result.length)
      {
        res.status(500).send({
                message: "Sorry! Data Not Found",
            }); 
      }
      else
      {
        res.status(200).send(result);
      }
};

exports.update_detail = (req, res) => {
  const id = req.params.id;

  Wh_so_det.update(req.body, {
    where: { wh_so_did: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Purchase Order Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Purchase Order Detail with id=${id}`,
      });
    }
  });
};