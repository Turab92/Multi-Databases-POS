const db = require("../../central/models/user");
const sequelize = require('sequelize');
const { json } = require("body-parser");

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;
  const Mart_ord_mas = db1.mart_ord_mas;
  const Mat_rate_setup = db1.mat_rate_setup;
  const Br_grn_det = db1.br_grn_det;
  const Raw_mat_cat = db1.raw_mat_cat;

  const mart_ord_mas = {
    dept_id: req.body.dept_id,
    day_id: req.body.day_id,
    shift_id: req.body.shift_id,
    till_id: req.body.till_id,
    ord_date: req.body.ord_date,
    cus_id: req.body.cus_id,
    user_id: req.body.user_id,
    ot_de_id: req.body.ot_de_id,
    pt_de_id: req.body.pt_de_id,
    total_amount: req.body.total_amount,
    discount: req.body.discount,
    tax_amount: req.body.tax_amount,
    net_amount: req.body.net_amount,
    cash_received: req.body.cash_received,
    cancel_reason: req.body.cancel_reason,
    status:'0',
  };
  var data = await Mat_rate_setup.findAll({
    where:{ material_id:req.body.material_id,status:1 }
  })
      if(data.length !=0 ){
        var data2 = await Raw_mat_cat.findAll({
          where:{ mat_cat_id:req.body.mat_cat_id,status:1 }
        })
            var tot= data[0].mat_current_rate * data2[0].mat_cat_uom * 1;
            var disc;
            if(data2[0].mat_cat_disc!=0)
            {
               disc=(tot/100)*data2[0].mat_cat_disc;
            }
            else
            {
              disc=0;
            }
          
            var data3 = await Br_grn_det.findAll({
              where : {material_id:req.body.material_id,dept_id:req.body.dept_id,status:1},
              attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
              [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${req.body.material_id} and "mart_order_details"."dept_id"=${req.body.dept_id} and "mart_order_details"."status"!=2)`),`so_qty`],
              ],
            })
              if(!data3.length)
              {
                 res.status(500).send({
                         message: "Data Not Found",
                    });
              }
              else
              {
                var avlqty=data3[0].dataValues.recv_qty - data3[0].dataValues.so_qty;
                if(avlqty>=data2[0].mat_cat_uom)
                {
                  var om_id;
                  var om_find = await Mart_ord_mas.findAll({
                    where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
                    });
                       if(om_find.length ==0 )
                       {
                        var om_add = await Mart_ord_mas.create(mart_ord_mas);
                        om_id=om_add.m_om_id
                       } 
                       else
                       {
                        om_id=om_find[0].m_om_id
                       }
                  var sub_data = await Mart_ord_det.findAll({
                    where:{
                      dept_id: req.body.dept_id,
                      m_om_id: om_id,
                      material_id: req.body.material_id,
                      mat_cat_id: req.body.mat_cat_id,
                    }
                  });
                   if(!sub_data.length)
                   {
                    const mart_ord_det = {
                      dept_id: req.body.dept_id,
                      m_om_id: om_id,
                      material_id: req.body.material_id,
                      mat_cat_id: req.body.mat_cat_id,
                      price: data[0].mat_current_rate * data2[0].mat_cat_uom,
                      purchase_rate: data[0].mat_purchase_rate,
                      quantity: 1,
                      total: tot,
                      discount: disc,
                      total_uom: data2[0].mat_cat_uom * 1.00,
                      net_total: tot-disc,
                      status:'0',
                      
                    };
                      var data4 = await Mart_ord_det.create(mart_ord_det)
                      return res.status(200).send(data4)
                   }
                   else
                   {
                      const mart_ord_det = {
                        quantity: sub_data[0].dataValues.quantity+1,
                        discount: sub_data[0].dataValues.discount+disc,
                        total: sub_data[0].dataValues.total+tot,
                        net_total: sub_data[0].dataValues.net_total+(tot - disc),
                        total_uom: parseFloat(sub_data[0].dataValues.total_uom + data2[0].mat_cat_uom),
                      };
                      var sub_update = await Mart_ord_det.update(mart_ord_det,{
                        where: { m_od_id: sub_data[0].dataValues.m_od_id}
                      });
                      return res.status(200).send(sub_update);
                   }
                }
                else
                {
                  res.status(202).send({
                    message:"Sorry Material Quantity not available",
                  });
                }
              }
      }
      else{
       
        res.status(202).send({
          message:"Sorry Material rate not define in Rate screen",
        });
      }
  

};
// ------------>
exports.order_place = async (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;
  const Mart_ord_mas = db1.mart_ord_mas;
  const Mat_rate_setup = db1.mat_rate_setup;
  const Br_grn_det = db1.br_grn_det;
  const Raw_mat_cat = db1.raw_mat_cat;
  const Order_type_detail = db1.ord_type_detail;
  const Pay_type_detail = db1.pay_type_detail;
  const Customers = db1.customers;

var arr=[];
// ------>loop
var details= JSON.parse(req.body.details)
for(var det of details){
  var data = await Mat_rate_setup.findAll({
    where:{ material_id:det.material_id,status:1 }
  })
      if(data.length !=0 ){
         var data2 = await Raw_mat_cat.findAll({
          where:{ mat_cat_id:det.mat_cat_id,status:1 }
        })
             var data3 = await Br_grn_det.findAll({
              where : {material_id:det.material_id,dept_id:req.body.dept_id,status:1},
              attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
              [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${det.material_id} and "mart_order_details"."dept_id"=${req.body.dept_id} and "mart_order_details"."status"!=2)`),`so_qty`],
              ],
            })
              if(!data3.length)
              {
                  var obj = {
                    material: det.material_id,
                    message:"Sorry Material purchase and sale details not found",
                  };
                  arr.push(obj);   
              }
              else
              {
                var avlqty=data3[0].dataValues.recv_qty - data3[0].dataValues.so_qty;
                var finl =data2[0].mat_cat_uom * det.quantity
                if(avlqty>=finl)
                {
                  
                }
                else
                {
                  var obj = {
                    material: det.material_id,
                    message:"Sorry Material Quantity not available",
                  };
                  arr.push(obj);
                }
              }
      }
      else{
        var obj = {
          material: det.material_id,
          message:"Sorry Material rate not define in Rate screen",
        };
        arr.push(obj);
      }
    }
// 
if(!arr.length){
var om_id;
var cus_id;
var om_find = await Mart_ord_mas.findAll({
  where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
  });
      if(om_find.length ==0 )
      {
        const ord_type_detail = {
          ord_type_id: req.body.ord_type_id,
          cus_id: req.body.cus_id,
          cus_name: req.body.cus_name,
          cus_phone: req.body.cus_phone,
          cus_email: req.body.cus_email,
          cus_address: req.body.cus_address,
          table_no: req.body.table_no,
          members: req.body.members,
          ord_booker: req.body.ord_booker,
          del_person: req.body.del_person,
          del_phone: req.body.del_phone,
          order_type: req.body.order_type,
          online_type: req.body.online_type,
          status:'1',
        };
        var ot_det = await Order_type_detail.create(ord_type_detail)

        const paym_type_detail = {
          pay_type_id: req.body.pay_type_id,
          cus_id: req.body.cus_id,
          card_no: req.body.card_no,
          card_type: req.body.card_type,
          acc_title: req.body.acc_title,
          bank_name: req.body.bank_name,
          per_name: req.body.per_name,
          per_phone: req.body.per_phone,
          per_email: req.body.per_email,
          reason: req.body.reason,
          cash_received: req.body.cash_received,
          cash_return: req.body.cash_return,
          status:'1',
        };
        var pt_det = await Pay_type_detail.create(paym_type_detail)

        if(req.body.is_customer==1)
        {
          const customer = {
            cus_name: req.body.cus_name,
            cus_phone: req.body.cus_phone,
            cus_email: req.body.cus_email,
            cus_address: req.body.cus_address,
            status:'1',
          };
         var find_cus= await Customers.findAll({
            where:{ cus_phone: req.body.cus_phone}
          })
            if(!find_cus.length)
            {
               var add_cus= await Customers.create(customer)
                    cus_id = add_cus.cus_id
                 
            }
            else
            {
              cus_id = find_cus[0].dataValues.cus_id
            }

        }
        else{
          cus_id=null
        }

        const mart_ord_mas = {
          dept_id: req.body.dept_id,
          day_id: req.body.day_id,
          shift_id: req.body.shift_id,
          till_id: req.body.till_id,
          ord_date: req.body.ord_date,
          cus_id: cus_id,
          user_id: req.body.user_id,
          ot_de_id: ot_det.ot_d_id,
          pt_de_id: pt_det.pt_d_id,
          total_amount: req.body.total_amount,
          disc_id: req.body.disc_id,
          discount: req.body.discount,
          tax_id: req.body.tax_id,
          tax_amount: req.body.tax_amount,
          net_amount: req.body.net_amount,
          cash_received: req.body.cash_received,
          cancel_reason: req.body.cancel_reason,
          is_print: req.body.is_print,
          status:1,
        };
        var om_add = await Mart_ord_mas.create(mart_ord_mas);
        om_id=om_add.m_om_id

        // ------>loop
        for(var det of details){
        var data = await Mat_rate_setup.findAll({
          where:{ material_id:det.material_id,status:1 }
        })
        var data2 = await Raw_mat_cat.findAll({
          where:{ mat_cat_id:det.mat_cat_id,status:1 }
        })
            var tot= data[0].mat_current_rate * data2[0].mat_cat_uom * det.quantity;
            var disc;
            if(data2[0].mat_cat_disc!=0)
            {
                disc=(tot/100)*data2[0].mat_cat_disc;
            }
            else
            {
              disc=0;
            } 
            var sub_data = await Mart_ord_det.findAll({
              where:{
                dept_id: req.body.dept_id,
                m_om_id: om_id,
                material_id: det.material_id,
                mat_cat_id: det.mat_cat_id,
              }
            });
             if(!sub_data.length)
             {
              const mart_ord_det = {
                dept_id: req.body.dept_id,
                m_om_id: om_id,
                material_id: det.material_id,
                mat_cat_id: det.mat_cat_id,
                price: data[0].mat_current_rate * data2[0].mat_cat_uom,
                purchase_rate: data[0].mat_purchase_rate,
                quantity: det.quantity,
                total: tot,
                discount: disc,
                total_uom: data2[0].mat_cat_uom * det.quantity,
                net_total: tot-disc,
                status:1,
                
              };
                var data4 = await Mart_ord_det.create(mart_ord_det)
               
             }
             else
             {
                const mart_ord_det = {
                  quantity: sub_data[0].dataValues.quantity+1,
                  discount: sub_data[0].dataValues.discount+disc,
                  total: sub_data[0].dataValues.total+tot,
                  net_total: sub_data[0].dataValues.net_total+(tot - disc),
                  total_uom: parseFloat(sub_data[0].dataValues.total_uom + data2[0].mat_cat_uom),
                };
                var sub_update = await Mart_ord_det.update(mart_ord_det,{
                  where: { m_od_id: sub_data[0].dataValues.m_od_id}
                });
               
             }
            }
            // <----- loop

            return res.status(200).send(om_add)
      } 
      else
      {
      res.status(202).send({
        message:"Please close the previous order",
      });
      }
    }
    else{
      res.status(202).send({
        message:"Some error occured while placing order",
        Error:arr
      });
    }
};


// <------------

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;
  const Mart_ord_mas = db1.mart_ord_mas;

    Mart_ord_mas.findAll({
      where: { user_id:req.params.id,status: 0 },
      })
        .then((data) => {
         
         if(data.length !=0 )
         {
          Mart_ord_det.findAll({
              where: {m_om_id:data[0].m_om_id, status: 0 },
                include: [
                  {
                    model: db.raw_material,
                    as: 'ord_raw'
                  },
                  {
                    model: db1.raw_mat_cat,
                    as: 'ord_mat_cat'
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
                  message: err.message || "Some error occured while retrieving Order Detail",
                });
              });
          } 
          
        })
        .catch((err) => {
             return  res.status(500).send({
            message: err.message || "Some error occurred while create the Order Master",
          }); 
    
        });  
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;

  const id = req.params.id;
  Mart_ord_det.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Mart Order Detail with id=" + id,
           });
     }
     else
     {
        res.status(200).send(data);
     }
     
    })
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;
  const Br_grn_det = db1.br_grn_det;
  const Raw_mat_cat = db1.raw_mat_cat;

  const id = req.params.id;
  Mart_ord_det.findByPk(id)//findone or findByPK return object
    .then((data) => {
      var tot= req.body.price * req.body.quantity;
      var disc;
     
      Raw_mat_cat.findAll({
        where:{ mat_cat_id:data.mat_cat_id,status:1 }
      })
     
        .then((data2) => {
      if(data2[0].mat_cat_disc!=0)
      {
         disc=(tot/100)*data2[0].mat_cat_disc;
      }
      else
      {
         disc=0;
      }

      const mart_ord_det = {
        
        quantity: req.body.quantity,
        total: tot,
        discount: disc,
        total_uom: data2[0].mat_cat_uom * req.body.quantity,
        net_total: tot-disc,
        // user_id: req.body.user_id,
        status:'0',
        
      };
     
      Br_grn_det.findAll({
        where : {material_id:data2[0].material_id,dept_id:data.dept_id,status:1},
        attributes: [[sequelize.fn('SUM', sequelize.col('recv_unit_qty')), 'recv_qty'],
        [sequelize.literal(`(SELECT SUM("mart_order_details"."total_uom") from "mart_order_details" where "mart_order_details"."material_id"=${data2[0].material_id} and "mart_order_details"."dept_id"=${data.dept_id} and "mart_order_details"."status"!=2)`),`so_qty`],
        ],
      })
      .then((data3) => {
        if(!data3.length)
        {
         
           res.status(500).send({
                   message: "Data Not Found",
              });
        }
        else
        {
          var avlqty=data3[0].dataValues.recv_qty - data3[0].dataValues.so_qty;
          if(avlqty>=data2[0].mat_cat_uom)
          {
            
           //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
            Mart_ord_det.update(mart_ord_det, {
              where: { m_od_id: id },
            }).then((data) => {
              if (data[0] != 0) {
                res.status(200).send({
                  message: "Mart Order Detail was updated successfully",
                });
              } else {
                res.status(500).send({
                  message: `Cannot update Mart Order Detail with id=${id}`,
                });
              }
            });
          }
          else
          {
            res.status(202).send({
              message:"Sorry Material Quantity not available",
            });
          }
        }
      })
    
     })
    });
};

exports.update1 = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;
  const Raw_mat_cat = db1.raw_mat_cat;

  const id = req.params.id;
  Mart_ord_det.findByPk(id)//findone or findByPK return object
    .then((data) => {
      var tot= req.body.price * req.body.quantity;
      var disc;
     
      Raw_mat_cat.findAll({
        where:{ mat_cat_id:data.mat_cat_id,status:1 }
      })
     
        .then((data2) => {
      if(data2[0].mat_cat_disc!=0)
      {
         disc=(tot/100)*data2[0].mat_cat_disc;
      }
      else
      {
        disc=0;
      }

      const mart_ord_det = {
        
        quantity: req.body.quantity,
        total: tot,
        discount: disc,
        total_uom: data2[0].mat_cat_uom * req.body.quantity,
        net_total: tot-disc,
        // user_id: req.body.user_id,
        status:'0',
        
      };    
           //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
            Mart_ord_det.update(mart_ord_det, {
              where: { m_od_id: id },
            }).then((data) => {
              if (data[0] != 0) {
                res.status(200).send({
                  message: "Mart Order Detail was updated successfully",
                });
              } else {
                res.status(500).send({
                  message: `Cannot update Mart Order Detail with id=${id}`,
                });
              }
            });
     })
    });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;

  const odid = req.params.odid;
  const omid = req.params.omid;

  Mart_ord_det.findAll({
    where: { m_om_id: omid }
    })
    .then((data) => {
      if(data.length ==1)
       {
          res.status(502).send({
            message: `Sorry you cannot delete last detail of this other`,
          });
       }
       else
       {
        Mart_ord_det.destroy({
            where: { m_od_id: odid },
          }).then((data) => {
            if (data) {
              res.status(200).send({
                message: "Order Detail was delete successfully!",
              });
            } else {
              res.status(500).send({
                message: `Cannot delete Order Detail with id=${odid}`,
              });
            }
          });
       }
          
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving Order Detail",
      });
    });

};
exports.update_detail = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_det = db1.mart_ord_det;

  const id = req.params.id;
  Mart_ord_det.update(req.body, {
    where: { m_om_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Order Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Order Detail with id=${id}`,
      });
    }
  });
};


