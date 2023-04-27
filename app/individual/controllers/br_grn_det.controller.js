const db = require("../../central/models/user");
const Raw_material = db.raw_material;
const Retailer =db.retailer
const sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const dbConfig = require("../../confiq/db.config");

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;
  const Raw_mat_det = db1.raw_mat_det;
  
  
  if (!req.body.br_grn_mid) {
    res.status(400).send({
      message: "GRN Master id can not be empty !",
    });
    return;
  }

  const br_grn_det = {
    br_grn_mid: req.body.br_grn_mid,
    material_id: req.body.material_id,
    price: req.body.price,
    ord_unit_qty: req.body.ord_unit_qty,
    recv_unit_qty: req.body.recv_unit_qty,
    total_amount: req.body.price * req.body.recv_unit_qty,
    dept_id: req.body.dept_id,
    status:'0',
  };
  var arr=[];
  var data1 = await  Raw_mat_det.findAll({
    where:{mat_mas_id:req.body.material_id},
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
  });
  if(!data1.length || req.body.br_po_mid == 0)
    {
      if(req.body.recv_unit_qty > req.body.ord_unit_qty)
      {
        res.status(409).send({
          message: "Received Quantity is greater than Order Quantity"
        });
      }
      else 
      {
      
        Br_grn_det.findAll({
          where:{
            br_grn_mid: req.body.br_grn_mid,
            material_id: req.body.material_id
          }
        })
          .then((data) => {
            if(!data.length)
            {
              
              Br_grn_det.create(br_grn_det)
              .then((data) => {
              res.status(200).send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while create the GRN Detail",
                });
              });
            }
            else
            {
              res.status(409).send({
                message: "Material Already Exist with this GRN Master id"+req.body.br_grn_mid,
              });
            }
          })
          .catch((err) => {
            res.status(502).send({
              message: err.message || "Some error occured while retrieving GRN Detail",
            });
          });
        }
    }
    else
        {
          var sum = 0;
          for(var det of data1)
          {
             var data = await  Br_grn_det.findAll({
              where : {material_id:det.dataValues.material_id,dept_id:req.body.dept_id,status:1},
              attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty',],[sequelize.literal(
                `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${req.body.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )` ),`pr`],
                [sequelize.literal(`(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."dept_id"=${req.body.dept_id} and "br_mat_sales"."status"!=2)`),`so_qty`],
                [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${det.dataValues.material_id} and "mart_order_details"."dept_id"=${req.body.dept_id} and "mart_order_details"."status"!=2)`),`mart_so_qty`],
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
                sum += parseFloat(det.dataValues.mat_det_uom*data[0].dataValues.pr);
                var resavlqty=data[0].dataValues.recv_qty - data[0].dataValues.so_qty;
                var avlqty=resavlqty - data[0].dataValues.mart_so_qty;
                var message;
                if(det.dataValues.mat_det_uom*req.body.recv_unit_qty<avlqty){
                  message = "Success"
                }else{
                  message = "Error"
                }
                var obj = {
                  material:  det.dataValues.material_id,
                  materialname:  det.dataValues.raw_det_mat.material_name,
                  AvailQty: avlqty,
                  ReqQty:det.dataValues.mat_det_uom*req.body.recv_unit_qty,
                  Message:message,
                  rate: sum
                };
                arr.push(obj)
              }

          }
          var flag = true;
          for(var array of arr){
            if(array.Message=="Error"){
              flag = false;
            }
          }

          if(flag== false)
          {
            res.status(203).send({"data":arr});
          }
          else
          {
            if(req.body.recv_unit_qty > req.body.ord_unit_qty)
            {
              res.status(409).send({
                message: "Received Quantity is greater than Order Quantity"
              });
            }
            else 
            {
              var grn_data = await Br_grn_det.findAll({
                where:{
                  br_grn_mid: req.body.br_grn_mid,
                  material_id: req.body.material_id
                }
              });
                  if(!grn_data.length)
                  {
                    
                   await Br_grn_det.create(br_grn_det);
                     saleorder(data1,req.body.dept_id,req.body.recv_unit_qty,res,req).then((res)=>{
                       return res.status(200).send("success in saleorder function");
                     }).catch((err)=>{
                      res.status(502).send({
                        message: err.message || "Error in sale order function",
                      });
                     })
                  
                  
                  }
                  else
                  {
                    res.status(409).send({
                      message: "Material Already Exist with this GRN Master id"+req.body.wh_grn_mid,
                    });
                  }
              
              }
      }
    }
};

async function saleorder(detail,deptid,qty,res,req)
{
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;
  const Br_mat_sale = db1.br_mat_sale;

    for( var det of detail)
    {
      var data5 = await  Br_grn_det.findAll({
        where : {material_id:det.dataValues.material_id,dept_id:deptid,status:1},
        attributes: [[sequelize.literal(`(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${deptid} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )` ),`pr`],
        ],
      });
        var total=det.dataValues.mat_det_uom*qty;
        const br_mat_sale = 
        {
          material_id: det.dataValues.material_id,
          so_unit_qty: total,
          price:data5[0].dataValues.pr,
          total_amount:total*data5[0].dataValues.pr,
          dept_id: deptid,
          status:'1',
        }

        var data3 = await Br_mat_sale.create(br_mat_sale)

    }
    return  res;
      
}

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

    Br_grn_det.findAll()
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
        message: err.message || "Some error occured while retrieving GRN Detail",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

  const id = req.params.id;
  Br_grn_det.findByPk(id)
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
        message: "Error retrieving GRN Detail with id=" + id,
      });
    });
};

exports.findMas = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

  const mas_id = req.params.mas_id;
  Br_grn_det.findAll({
    where: {br_grn_mid:mas_id},
    
      include: [
        {
          model: db.raw_material,
          as: 'br_grn_mat'
    
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
        message: "Error retrieving Purchase Request Detail with id=" + mas_id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

  const id = req.params.id;
  Br_grn_det.update(req.body, {
    where: { br_grn_mid: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "GRN Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update GRN Detail with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

  const id = req.params.id;
  Br_grn_det.destroy({
    where: { br_grn_did: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "GRN Detail was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete GRN Detail with id=${id}`,
      });
    }
  });
};
exports.findRate = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

  const matid = req.params.mat_id;
  const deptid = req.params.dept_id;
  Br_grn_det.findAll({
    limit: 1,
    where:{ material_id:matid,status:1 },
    attributes: ['price'],
    order: [ [ 'br_grn_did', 'DESC' ]]
  })
    .then((data) => {
      if(!data)
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
exports.findInventory = async (req,res) =>{
  // Raw_material.findAll({
  //   where:{status:1},
  //   attributes: [
  //   [sequelize.literal(`(SELECT SUM(sale.quantity) FROM mart_order_details sale WHERE sale.material_id = grn.material_id and sale.status != 2 and sale.dept_id = 2)`),`sale`],
  //   [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${req.params.mat_id} and "mart_order_details"."dept_id"=${req.params.dept_id} and "mart_order_details"."status"!=2)`),`so_qty`],
  //   ],
  // })
  const deptid = req.params.dept_id;

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
  
  const result = await sequelize.query(`Select grn.material_id, raw.material_name, SUM(grn.recv_unit_qty) as purchase,
  (SELECT SUM(sale.quantity) FROM mart_order_details sale WHERE sale.material_id = grn.material_id and sale.status != 2 and sale.dept_id = `+deptid+`) as sale from
  br_grn_details as grn join raw_materials as raw on raw.material_id = grn.material_id
  where grn.status = 1 and grn.dept_id = `+deptid+` and raw.status = 1
  group by grn.material_id, raw.material_name
  
  `, { type: QueryTypes.SELECT });
  
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
}
exports.findAvailQty = (req, res) => {
  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;

  Br_grn_det.findAll({
    where : {material_id:req.params.mat_id,dept_id:req.params.dept_id,status:1},
    attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
    [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${req.params.mat_id} and "mart_order_details"."dept_id"=${req.params.dept_id} and "mart_order_details"."status"!=2)`),`so_qty`],
    ],
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
      var avlqty=data[0].dataValues.recv_qty - data[0].dataValues.so_qty;
       res.send({"data":avlqty});
    }
  })
  .catch((err) => {
    res.status(502).send({
      message: err.message || "Some error occured while retrieving GRN Detail",
    });
  });
};

exports.RawAvailQtyReport = async (req, res) => {
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
  const Br_grn_det = db1.br_grn_det;

  if(req.body.material_id==undefined || req.body.dept_id==undefined || req.body.material_id=='' || req.body.dept_id=='')
  {
    res.status(422).send({
      message: "Department or material cannot be null",
    });
  }
  else
  {
      if(req.body.material_id=='All')
      {
        var data1 = await  Raw_material.findAll({
          where:{status:1},
          include: [
            {
              model: db.uom,
              as: 'uom'
            }
          ]
        });
      }
      else
      {
        var data1 = await  Raw_material.findAll({
            where:{material_id:req.body.material_id},
            include: [
              {
                model: db.uom,
                as: 'uom'
              }
            ]
          });
      }
        if(!data1.length)
        {
          res.status(422).send({
                  message: "No detail found",
              });
        }
        else
        {
          var arr=[];
          for(var det of data1){
          var data = await  Br_grn_det.findAll({
              where : {material_id:det.dataValues.material_id,dept_id:req.body.dept_id,status:1},
              attributes: [
                [sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
              [sequelize.literal(`(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"=1 and "br_mat_sales"."dept_id"=${req.body.dept_id})`),`so_qty`],
              [sequelize.literal(`(SELECT "department_setups"."dept_name" from "department_setups" where "department_setups"."dept_id"=${req.body.dept_id})`),`dept`],
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
          
                var avlqty=data[0].dataValues.recv_qty - data[0].dataValues.so_qty;
                var obj = {
                  Depart: data[0].dataValues.dept,
                  material:  det.dataValues.material_id,
                  materialname:  det.dataValues.material_name,
                  UOM:det.dataValues.uom.uom_name,
                  AvailQty: avlqty,
                };
                arr.push(obj)
              }

          }
          res.send({"data":arr});
        }
  
  }
};
