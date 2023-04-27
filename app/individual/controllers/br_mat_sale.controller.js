const db = require("../../central/models/user");
const Retailer =db.retailer
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { body,validationResult  } = require('express-validator');
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const dbConfig = require("../../confiq/db.config");

exports.validate = (method) => {
  switch (method) {
    case 'createDD': {
     return [ 
        body('om_id', 'Master id is required').notEmpty(),
        body('om_id', 'Master id value must be in integer').isInt(),
        body('od_id', 'Detail id is required').notEmpty(),
        body('od_id', 'Detail id value must be in integer').isInt(),
        body('dept_id', 'dept_id is required').notEmpty(),
        body('dept_id', 'dept_id value must be in integer').isInt(),
        body('sub_pro_id', 'sub_pro_id is required').notEmpty(),
        body('sub_pro_id', 'sub_pro_id value must be in integer').isInt(),
        body('ds_id', 'ds_id is required').notEmpty(),
        body('ds_id', 'ds_id value must be in integer').isInt(),
        body('material_id', 'material_id is required').notEmpty(),
        body('material_id', 'material_id value must be in integer').isInt(),
        body('so_unit_qty', 'so_unit_qty is required').notEmpty(),
        body('so_unit_qty', 'so_unit_qty value must be in integer').isFloat(),
        body('price', 'price value must be in integer').isFloat(),
        body('total_amount', 'total_amount value must be in integer').isFloat(),
       ]
          
    }
    case 'updateDD': {
      return [ 
        body('om_id', 'Master id is required').notEmpty(),
        body('om_id', 'Master id value must be in integer').isInt(),
        body('od_id', 'Detail id is required').notEmpty(),
        body('od_id', 'Detail id value must be in integer').isInt(),
        body('dept_id', 'dept_id is required').notEmpty(),
        body('dept_id', 'dept_id value must be in integer').isInt(),
        body('sub_pro_id', 'sub_pro_id is required').notEmpty(),
        body('sub_pro_id', 'sub_pro_id value must be in integer').isInt(),
        body('ds_id', 'ds_id is required').notEmpty(),
        body('ds_id', 'ds_id value must be in integer').isInt(),
        body('material_id', 'material_id is required').notEmpty(),
        body('material_id', 'material_id value must be in integer').isInt(),
        body('so_unit_qty', 'so_unit_qty is required').notEmpty(),
        body('so_unit_qty', 'so_unit_qty value must be in integer').isFloat(),
        body('price', 'price value must be in integer').isFloat(),
        body('total_amount', 'total_amount value must be in integer').isFloat(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Br_mat_sale = db1.br_mat_sale;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const br_mat_sale = {
        om_id: req.body.om_id,
        od_id: req.body.od_id,
        dept_id: req.body.dept_id,
        sub_pro_id: req.body.sub_pro_id,
        ds_id: req.body.ds_id,
        material_id: req.body.material_id,
        so_unit_qty: req.body.so_unit_qty,
        price: req.body.price,
        total_amount: req.body.total_amount,
        status:'1',
      };
      Br_mat_sale.findAll({
        where:{till_id: req.body.till_id,active:1}
      })
      .then((data) => {
        if(!data.length)
        {
          Br_mat_sale.create(br_mat_sale)
          .then((data) => {
          res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Daily days",
            });
          });
          
        }
        else
        {
          res.status(501).send({
            message: "Please Close The Previous Day",
      });
        }
        })
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Br_mat_sale = db1.br_mat_sale;

    Br_mat_sale.findAll()
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
        message: err.message || "Some error occured while retrieving Daily days",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Br_mat_sale = db1.br_mat_sale;

  Br_mat_sale.findByPk(req.params.id)
  .then((data) => {
    if(!data.length)
    {
       res.status(500).send({
               message: "Data Not Found",
          });
    }
    else
    {
      
       res.send({"data":data});
    }
  })
  .catch((err) => {
    res.status(502).send({
      message: err.message || "Error retrieving Daily days with id=" + req.params.id,
    });
  });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_mat_sale = db1.br_mat_sale;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Br_mat_sale.update(req.body, {
      where: { br_sale_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Daily days was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Daily days with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Br_mat_sale = db1.br_mat_sale;

  const id = req.params.id;

  Br_mat_sale.destroy({
    where: { br_sale_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Daily days was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Daily days with id=${id}`,
      });
    }
  });
};

exports.RawSaleReport = async (req, res) => {
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
  const Br_mat_sale = db1.br_mat_sale;

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
          dept_id:req.body.dept_id,
          material_id:req.body.material_id,
          status:1 
        }
      }
      else
      {
        check = 
        {
          dept_id:req.body.dept_id,
          material_id:req.body.material_id,
          status:1 
        }
      }
    Br_mat_sale.findAll({
      where: check,
        include: [
          {
            model: db.raw_material,
            as: 'br_so_mat',
            include: [
              {
                model: db.uom,
                as: 'uom',
                attributes:['uom_name']
              }
            ]
      
          },
          {
            model: db.department_setup,
            as: 'br_sale_mat_dept',
            attributes:['dept_id','dept_name']
          },
          {
            model: db1.sub_products,
            as: 'br_so_sub',
            attributes:['sub_pro_id','sub_pro_name']
          },
          {
            model: db1.deal_setup,
            as: 'br_so_deal',
            attributes:['ds_id','ds_name']
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

      if(req.body.dept_id== '')
      {
        query=`Select Sum(so_unit_qty),raw_materials.material_id,raw_materials.material_name,to_char(date("br_mat_sales"."createdAt"),'YYYY-MM') as year_month from br_mat_sales, raw_materials where br_mat_sales.status=1
        and br_mat_sales.material_id=raw_materials.material_id
        GROUP BY year_month,raw_materials.material_id
        ORDER By raw_materials.material_id`;
      }
      else
      {
        query=`Select Sum(so_unit_qty),raw_materials.material_id,raw_materials.material_name,to_char(date("br_mat_sales"."createdAt"),'YYYY-MM') as year_month from br_mat_sales, raw_materials where br_mat_sales.status=1
        and br_mat_sales.material_id=raw_materials.material_id
        and br_mat_sales.dept_id=${deptid}
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
