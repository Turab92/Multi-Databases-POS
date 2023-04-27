const db = require("../../central/models/user");

const { body,validationResult  } = require('express-validator');

// exports.validate = (method) => {
//     switch (method) {
//       case 'createOT': {
//        return [ 
//           body('ord_type_id', 'Order type is required').notEmpty(),
//           body('ord_type_id', 'Order type value must be in integer').isInt(),
//           body('cus_id', 'Customer value must be in integer').optional().isInt().if(body('cus_id').exists()),
//           body('cus_email', 'Customer invalid email').optional().isEmail().if(body('cus_email').exists()),
//           body('cus_name', 'Customer name is required').notEmpty().if(body('cus_name').exists()),
//           body('cus_phone', 'Customer phone is required').notEmpty().if(body('cus_phone').exists()),
//           body('cus_phone', 'Customer invalid phone number').optional().isInt().if(body('cus_phone').exists()),
//           body('cus_phone', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }).if(body('cus_phone').exists()),
//           body('table_no', 'Table no value must be in integer').optional().isInt().if(body('table_no').exists()),
//           body('members', 'Members value must be in integer').optional().isInt().if(body('members').exists()),
//           body('ord_booker', 'Order booker value must be in integer').optional().isInt().if(body('ord_booker').exists()),
//           body('del_phone', 'Invalid phone number').optional().isInt().if(body('del_phone').exists()),
//           body('del_phone', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }).if(body('del_phone').exists()),
//          ]   
//       }
//     }
// }

exports.create = (req, res) => {
  const db1=req.ret_db
  const Order_type_detail = db1.ord_type_detail;
  const Order_master = db1.order_master;

      let omid = req.body.om_id;
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

      Order_master.findAll({
        where: { om_id: omid },
        })
          .then((data) => {
          if((data[0].ot_de_id ==null) || (data[0].ot_de_id ==''))
          {
            Order_type_detail.create(ord_type_detail)
              .then((data) => {
                const ord_mas_ot = {
                  ot_de_id: data.ot_d_id,
                };
                Order_master.update(ord_mas_ot, {
                  where: { om_id: omid },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Order Type detail updated successfully in order master",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Order Type detail in Order Master with id=${omid}`,
                    });
                  }
                });
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while create the order type detail",
                });
              });
          } 
          else
          {
            Order_type_detail.create(ord_type_detail)
            .then((data1) => {
              const ord_mas_ot = {
                ot_de_id: data1.ot_d_id,
              };
              Order_master.update(ord_mas_ot, {
                where: { om_id: omid },
              }).then((data2) => {
                if (data2[0] != 0) {
                  
                  Order_type_detail.destroy({
                    where: { ot_d_id: data[0].ot_de_id },
                  }).then((data3) => {
                    if (data3[0] != 0) {
                      res.status(200).send({
                        message: "Order Type detail updated successfully in order master",
                      });
                    } 
                    else
                    {
                      res.status(500).send({
                        message: `Cannot Order type detail with id=${data[0].ot_de_id}`,
                      });
                    }
                  });
                  res.status(200).send({
                    message: "Order Type detail updated successfully in order master",
                  });
                } else {
                  res.status(500).send({
                    message: `Cannot update Order Type detail in Order Master with id=${omid}`,
                  });
                }
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the order type detail",
              });
            });
             

          }
            
          })
          .catch((err) => {
              return  res.status(500).send({
              message: err.message || "Some error occurred while retreving the Order Master",
            }); 
      
          }); 
    
};

exports.create1 = (req, res) => {
  const db1=req.ret_db
  const Order_type_detail = db1.ord_type_detail;
  const Mart_ord_mas = db1.mart_ord_mas;
 
      let omid = req.body.m_om_id;
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
        status:'1',
      };

      Mart_ord_mas.findAll({
        where: { m_om_id: omid },
        })
          .then((data) => {
          if((data[0].ot_de_id ==null) || (data[0].ot_de_id ==''))
          {
            Order_type_detail.create(ord_type_detail)
              .then((data) => {
                const ord_mas_ot = {
                  ot_de_id: data.ot_d_id,
                };
                Mart_ord_mas.update(ord_mas_ot, {
                  where: { m_om_id: omid },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Order Type detail updated successfully in order master",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Order Type detail in Order Master with id=${omid}`,
                    });
                  }
                });
              })
              .catch((err) => {
                res.status(500).send({
                  message: err.message || "Some error occurred while create the order type detail",
                });
              });
          } 
          else
          {
            Order_type_detail.update(ord_type_detail, {
                where: { ot_d_id: data[0].ot_de_id },
              }).then((data) => {
                if (data[0] != 0) {
                  res.status(200).send({
                    message: "Order type detail was updated successfully",
                  });
                } else {
                  res.status(500).send({
                    message: `Cannot Order type detail with id=${data[0].ot_de_id}`,
                  });
                }
              });
          }
            
          })
          .catch((err) => {
              return  res.status(500).send({
              message: err.message || "Some error occurred while retreving the Order Master",
            }); 
      
          }); 
    
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Order_type_detail = db1.ord_type_detail;

  Order_type_detail.findAll()
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
        message: err.message || "Some error occured while retrieving Order Type Detail",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Order_type_detail = db1.ord_type_detail;

  const id = req.params.id;
  Order_type_detail.findByPk(id)
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
        message: "Error retrieving Order Type Detail with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Order_type_detail = db1.ord_type_detail;

  const id = req.params.id;
  Order_type_detail.update(req.body, {
    where: { ot_d_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Order Type Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Order Type Detail with id=${id}`,
      });
    }
  });
};

exports.findMas = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  let omid = req.params.id;
  Order_master.findAll({
    where: {  om_id: omid },
      include: [
        {
          model: db1.ord_type_detail,
          as: 'ot_details',
          include: [
            {
              model: db1.order_type,
               as: 'online_ord_type',
               attributes:['o_type_id','o_type_name'],
            }
          ]
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
        message: err.message || "Some error occured while retrieving order type detail",
      });
    });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Order_type_detail = db1.ord_type_detail;

  const id = req.params.id;
  Order_type_detail.destroy({
    where: { ot_d_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Order Type Detail was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Order Type Detail with id=${id}`,
      });
    }
  });
};


