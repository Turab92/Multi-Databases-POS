const db = require("../models/user");
const Wh_grn_det = db.wh_grn_det;
//const Raw_mat_det = db.raw_mat_det;
const sequelize = require('sequelize');
const Wh_so_mas = db.wh_so_mas;
const Wh_so_det = db.wh_so_det;
const Raw_material = db.raw_material;

exports.create = async (req, res) => {
  if (!req.body.wh_grn_mid) {
    res.status(400).send({
      message: "GRN Master id can not be empty !",
    });
    return;
  }

  const wh_grn_det = {
    wh_grn_mid: req.body.wh_grn_mid,
    material_id: req.body.material_id,
    price: req.body.price,
    ord_unit_qty: req.body.ord_unit_qty,
    recv_unit_qty: req.body.recv_unit_qty,
    total_amount: req.body.price * req.body.recv_unit_qty,
    dept_id: req.body.dept_id,
    status:'0',
  };
  var arr=[];
  // var data1 = await  Raw_mat_det.findAll({
  //   where:{mat_mas_id:req.body.material_id},
  //   include: [
  //     {
  //       model: db.raw_material,
  //       as: 'raw_det_mas'
  
  //     },
  //     {
  //       model: db.raw_material,
  //       as: 'raw_det_mat'
  
  //     }
  //   ]
  // });

    // if(!data1.length)
    // {
      if(req.body.recv_unit_qty > req.body.ord_unit_qty)
      {
        res.status(409).send({
          message: "Received Quantity is greater than Order Quantity"
        });
      }
      else 
      {
        Wh_grn_det.findAll({
          where:{
            wh_grn_mid: req.body.wh_grn_mid,
            material_id: req.body.material_id,
          }
        })
          .then((data) => {
            if(!data.length)
            {
              
              Wh_grn_det.create(wh_grn_det)
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
                message: "Material Already Exist with this GRN Master id"+req.body.wh_grn_mid,
              });
            }
          })
          .catch((err) => {
            res.status(502).send({
              message: err.message || "Some error occured while retrieving GRN Detail",
            });
          });
        }
        //}
    //     else
    //     {
    //       var sum = 0;
    //       for(var det of data1)
    //       {
    //          var data = await  Wh_grn_det.findAll({
    //           where : {material_id:det.dataValues.material_id,dept_id:req.body.dept_id,status:1},
    //           attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty',],[sequelize.literal(
    //             `(Select price from wh_grn_details where wh_grn_details."material_id"=${det.dataValues.material_id} and "wh_grn_details"."dept_id"=${req.body.dept_id} and wh_grn_details.status=1 ORDER BY wh_grn_details.wh_grn_did DESC LIMIT 1 )` ),`pr`],
    //           [sequelize.literal(`(SELECT SUM("wh_so_details"."so_unit_qty") from "wh_so_details" where "wh_so_details"."material_id"=${det.dataValues.material_id} and "wh_so_details"."par_dept_id"=${req.body.dept_id})`),`so_qty`],
    //           ],
    //         });
    //           if(!data.length)
    //           {
    //             res.status(500).send({
    //                     message: "Data Not Found",
    //                 });
    //           }
    //           else
    //           {
    //             sum += parseFloat(det.dataValues.mat_det_uom*data[0].dataValues.pr);
    //             var avlqty=data[0].dataValues.recv_qty - data[0].dataValues.so_qty;
    //             var message;
    //             if(det.dataValues.mat_det_uom*req.body.recv_unit_qty<avlqty){
    //               message = "Success"
    //             }else{
    //               message = "Error"
    //             }
    //             var obj = {
    //               material:  det.dataValues.material_id,
    //               materialname:  det.dataValues.raw_det_mat.material_name,
    //               AvailQty: avlqty,
    //               ReqQty:det.dataValues.mat_det_uom*req.body.recv_unit_qty,
    //               Message:message,
    //               rate: sum
    //             };
    //             arr.push(obj)
    //           }

    //       }
    //       var flag = true;
    //       for(var array of arr){
    //         if(array.Message=="Error"){
    //           flag = false;
    //         }
    //       }

    //       if(flag== false)
    //       {
    //         res.status(203).send({"data":arr});
    //       }
    //       else
    //       {
    //         if(req.body.recv_unit_qty > req.body.ord_unit_qty)
    //         {
    //           res.status(409).send({
    //             message: "Received Quantity is greater than Order Quantity"
    //           });
    //         }
    //         else 
    //         {
    //           var grn_data = await Wh_grn_det.findAll({
    //             where:{
    //               wh_grn_mid: req.body.wh_grn_mid,
    //               material_id: req.body.material_id,
    //             }
    //           });
    //               if(!grn_data.length)
    //               {
                    
    //                await Wh_grn_det.create(wh_grn_det);
    //                  saleorder(data1,req.body.dept_id,req.body.recv_unit_qty,res).then((res)=>{
    //                    return res.status(200).send("success in saleorder function");
    //                  }).catch((err)=>{
    //                   res.status(502).send({
    //                     message: err.message || "Error in sale order function",
    //                   });
    //                  })
                  
                  
    //               }
    //               else
    //               {
    //                 res.status(409).send({
    //                   message: "Material Already Exist with this GRN Master id"+req.body.wh_grn_mid,
    //                 });
    //               }
              
    //           }
    //   }
    // }
  
};

async function saleorder(detail,deptid,qty,res)
{
  const wh_so_mas = 
  {
    wh_so_date: Date.now().toString(),
    par_dept_id: deptid,
    status:'1',
  };
    var data2 = await   Wh_so_mas.create(wh_so_mas);
    for( var det of detail)
    {
      var data5 = await  Wh_grn_det.findAll({
        where : {material_id:det.dataValues.material_id,dept_id:deptid,status:1},
        attributes: [[sequelize.literal(`(Select price from wh_grn_details where wh_grn_details."material_id"=${det.dataValues.material_id} and "wh_grn_details"."dept_id"=${deptid} and wh_grn_details.status=1 ORDER BY wh_grn_details.wh_grn_did DESC LIMIT 1 )` ),`pr`],
        ],
      });
        var total=det.dataValues.mat_det_uom*qty;
        const wh_so_det = 
        {
          wh_so_mid: data2.dataValues.wh_so_mid,
          material_id: det.dataValues.material_id,
          so_unit_qty: total,
          price:data5[0].dataValues.pr,
          total_amount:total*data5[0].dataValues.pr,
          par_dept_id: deptid,
          status:'1',
        }

        var data3 = await Wh_so_det.create(wh_so_det)

    }
    return  res;
      
}

exports.findAll = (req, res) => {
    Wh_grn_det.findAll()
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
  const id = req.params.id;
  Wh_grn_det.findByPk(id)
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
  const mas_id = req.params.mas_id;
  Wh_grn_det.findAll({
    where: {wh_grn_mid:mas_id},
      include: [
        {
          model: db.raw_material,
          as: 'grn_mat'
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
        message: "Error retrieving GRN Detail with id=" + mas_id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Wh_grn_det.update(req.body, {
    where: { wh_grn_mid: id },
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
  const id = req.params.id;

  Wh_grn_det.destroy({
    where: { wh_grn_did: id },
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

exports.findAvailQty = (req, res) => {
  Wh_grn_det.findAll({
    where : {material_id:req.params.mat_id,dept_id:req.params.par_dept_id,status:1},
    attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
    [sequelize.literal(`(SELECT SUM("wh_so_details"."so_unit_qty") from "wh_so_details" where "wh_so_details"."material_id"=${req.params.mat_id} and "wh_so_details"."par_dept_id"=${req.params.par_dept_id})`),`so_qty`],
    ],
    
      // include: [
      //     {
      //       model: db.wh_so_det,
      //       as: 'so_det',
      //       where : {material_id:req.params.id},
      //       attributes: [[sequelize.fn('SUM', sequelize.col('so_unit_qty')), 'so_qty']],
      //     }
      //   ],
      //   group : [['wh_grn_did'],['wh_so_did']]
    
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
          var data = await  Wh_grn_det.findAll({
              where : {material_id:det.dataValues.material_id,dept_id:req.body.dept_id,status:1},
              attributes: [
                [sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
              [sequelize.literal(`(SELECT SUM("wh_so_details"."so_unit_qty") from "wh_so_details" where "wh_so_details"."material_id"=${det.dataValues.material_id} and "wh_so_details"."status"=1 and "wh_so_details"."par_dept_id"=${req.body.dept_id})`),`so_qty`],
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

