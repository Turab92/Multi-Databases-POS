const db = require("../../central/models/user");
const sequelize = require('sequelize');
exports.create = async (req, res) => {
  const db1=req.ret_db
  const Br_po_det = db1.br_po_det;
  const Br_grn_det = db1.br_grn_det;
  const Raw_mat_det = db1.raw_mat_det;

  if (!req.body.br_po_mid) {
    res.status(400).send({
      message: "Order Master id can not be empty !",
    });
    return;
  }

  const br_po_det = {
    br_po_mid: req.body.br_po_mid,
    material_id: req.body.material_id,
    price: req.body.price,
    req_unit_qty: req.body.req_unit_qty,
    po_unit_qty: req.body.po_unit_qty,
    total_amount: req.body.price * req.body.po_unit_qty,
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
  if(!data1.length)
  {
      if(req.body.po_unit_qty > req.body.req_unit_qty)
      {
        res.status(409).send({
          message: "Received Quantity is greater than Order Quantity"
        });
      }
      else 
      {
    
        Br_po_det.findAll({
          where:{
            br_po_mid: req.body.br_po_mid,
            material_id: req.body.material_id
          }
        })
          .then((data) => {
            if(!data.length)
            {
              
              Br_po_det.create(br_po_det)
              .then((data) => {
              res.status(200).send(data);
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while create the Purchase Order Detail",
                });
              });
            }
            else
            {
              res.status(409).send({
                message: "Material Already Exist with this Purchase Order Master id"+req.body.br_po_mid,
              });
            }
          })
          .catch((err) => {
            res.status(502).send({
              message: err.message || "Some error occured while retrieving Purchase Order Detail",
            });
          });
        }
      }
      else
    {
     
      for(var det of data1){
       var data = await  Br_grn_det.findAll({
          where : {material_id:det.dataValues.material_id,dept_id:req.body.dept_id,status:1},
          attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
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
      
            var resavlqty=data[0].dataValues.recv_qty - data[0].dataValues.so_qty;
            var avlqty=resavlqty - data[0].dataValues.mart_so_qty;
            var message;
            if(det.dataValues.mat_det_uom*req.body.po_unit_qty<avlqty){
              message = "Success"
            }else{
              message = "Error"
            }
            var obj = {
              material:  det.dataValues.material_id,
              materialname:  det.dataValues.raw_det_mat.material_name,
              AvailQty: avlqty,
              ReqQty:det.dataValues.mat_det_uom*req.body.po_unit_qty,
              Message:message
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
          if(req.body.po_unit_qty > req.body.req_unit_qty)
          {
            res.status(409).send({
              message: "Received Quantity is greater than Order Quantity"
             });
          }
          else 
          {
         
            Br_po_det.findAll({
              where:{
                br_po_mid: req.body.br_po_mid,
                material_id: req.body.material_id
              }
            })
              .then((data) => {
                if(!data.length)
                {
                  
                  Br_po_det.create(br_po_det)
                  .then((data) => {
                  res.status(200).send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message || "Some error occurred while create the Purchase Order Detail",
                    });
                  });
                }
                else
                {
                  res.status(409).send({
                    message: "Material Already Exist with this Purchase Order Master id"+req.body.br_po_mid,
                  });
                }
              })
              .catch((err) => {
                res.status(502).send({
                  message: err.message || "Some error occured while retrieving Purchase Order Detail",
                });
              });
            }
      }
    }
};

exports.EstPrice = async (req, res) => {

  const db1=req.ret_db
  const Br_grn_det = db1.br_grn_det;
  const Raw_mat_det = db1.raw_mat_det;

  var data1 = await  Raw_mat_det.findAll({
    where:{mat_mas_id:req.params.material_id},
    include: [
            {
              model: db.raw_material,
              as: 'raw_det_mat'
        
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
          where : {material_id:det.dataValues.material_id,dept_id:req.params.dept_id,status:1},
          attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
          [sequelize.literal(`(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${req.params.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )` ),`pr`],
          [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${det.dataValues.material_id} and "mart_order_details"."dept_id"=${req.params.dept_id} and "mart_order_details"."status"!=2)`),`mart_so_qty`],
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
            console.log(data[0].dataValues.pr)
            if(data[0].dataValues.pr == null){
            var obj = {
                materialname:  det.dataValues.raw_det_mat.material_name
              };
               arr.push(obj)
            }
            
          }

      }
        return res.status(200).send({"Est_Rate":sum,"data":arr});
     
    }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Br_po_det = db1.br_po_det;

  Br_po_det.findAll()
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
  const db1=req.ret_db
  const Br_po_det = db1.br_po_det;

  const id = req.params.id;
  Br_po_det.findByPk(id)
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
  const db1=req.ret_db
  const Br_po_det = db1.br_po_det;

  const mas_id = req.params.mas_id;
  Br_po_det.findAll({
    where: {br_po_mid:mas_id},
    
      include: [
        {
          model: db.raw_material,
          as: 'br_po_mat'
    
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
        message: "Error retrieving Purchase Order Detail with id=" + mas_id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_po_det = db1.br_po_det;

  const id = req.params.id;
  Br_po_det.update(req.body, {
    where: { br_po_mid: id },
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
  const db1=req.ret_db
  const Br_po_det = db1.br_po_det;

  const id = req.params.id;
  Br_po_det.destroy({
    where: { br_po_did: id },
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


