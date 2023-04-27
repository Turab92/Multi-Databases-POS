const db = require("../../central/models/user");
const Department_setup = db.department_setup;
const Retailer =db.retailer
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const dbConfig = require("../../confiq/db.config");

// exports.create = (req, res) => {
//   if (!req.body.ord_date) {
//     res.status(400).send({
//       message: "Order Date can not be empty !",
//     });
//     return;
//   }
// let subid = req.params.id;
//   const order_master = {
//     dept_id: req.body.dept_id,
//     on_om_id: req.body.on_om_id,
//     day_id: req.body.day_id,
//     till_id: req.body.till_id,
//     ord_date: req.body.ord_date,
//     cus_id: req.body.cus_id,
//     user_id: req.body.user_id,
//     ot_de_id: req.body.ot_de_id,
//     pt_de_id: req.body.pt_de_id,
//     total_amount: req.body.total_amount,
//     discount: req.body.discount,
//     tax_amount: req.body.tax_amount,
//     delivery_charges: req.body.delivery_charges,
//     net_amount: req.body.net_amount,
//     cancel_reason: req.body.cancel_reason,
//     status:'0',
//   };

//   Order_master.findAll({
//   where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
//   })
//     .then((data) => {
     
//      if(data.length ==0 )
//      {
//       Order_master.create(order_master)
//       .then((data) => {
//           return res.redirect('/add_orddetail/'+data.om_id+'/'+subid+'/'+req.body.dept_id)

//       })
//       .catch((err) => {
//          return  res.status(500).send({
//           message: err.message || "Some error occurred while create the Order Master",
//         });
//       });
      
//      } 
//      else
//      {
//       return res.redirect('/add_orddetail/'+data[0].om_id+'/'+subid+'/'+req.body.dept_id)
//      }
      
//     })
//     .catch((err) => {
//          return  res.status(500).send({
//         message: err.message || "Some error occurred while create the Order Master",
//       }); 

//     });  
// };

// exports.create2 = (req, res) => {
//   let dealid = req.params.id;
//   let dbid = req.body.db_id;
//   console.log("beverage"+dbid)
//     const order_master = {
//       dept_id: req.body.dept_id,
//       on_om_id: req.body.on_om_id,
//       day_id: req.body.day_id,
//       till_id: req.body.till_id,
//       ord_date: req.body.ord_date,
//       cus_id: req.body.cus_id,
//       user_id: req.body.user_id,
//       ot_de_id: req.body.ot_de_id,
//       pt_de_id: req.body.pt_de_id,
//       total_amount: req.body.total_amount,
//       discount: req.body.discount,
//       tax_amount: req.body.tax_amount,
//       delivery_charges: req.body.delivery_charges,
//       net_amount: req.body.net_amount,
//       cancel_reason: req.body.cancel_reason,
//       status:'0',
//     };
  
//     Order_master.findAll({
//     where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
//     })
//       .then((data) => {
       
//        if(data.length ==0 )
//        {
//         Order_master.create(order_master)
//         .then((data) => {
//             return res.redirect('/add_od_deal/'+data.om_id+'/'+dealid+'/'+req.body.dept_id+'/'+dbid)
  
//         })
//         .catch((err) => {
//            return  res.status(500).send({
//             message: err.message || "Some error occurred while create the Order Master",
//           });
//         });
        
//        } 
//        else
//        {
//         return res.redirect('/add_od_deal/'+data[0].om_id+'/'+dealid+'/'+req.body.dept_id+'/'+dbid)
//        }
        
//       })
//       .catch((err) => {
//            return  res.status(500).send({
//           message: err.message || "Some error occurred while create the Order Master",
//         }); 
  
//       });  
//   };
  

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

    Order_master.findAll()
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
        message: err.message || "Some error occured while retrieving Order Master",
      });
    });
};

exports.findCompleted = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const deptid = req.params.dept_id;
  Order_master.findAll({
    where:{dept_id:deptid,status:1},
    include: [
      {
        model: db1.order_detail,
        as: 'ord_detail',
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products'
          },
          {
            model: db1.deal_setup,
            as: 'deal_setups'
          } 
        ]
      },
      {
        model: db1.customers,
        as: 'customers'
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
      message: err.message || "Some error occured while retrieving Order Master",
    });
  });
};


exports.findHolds = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  let userid = req.params.id;
  Order_master.findAll({
  where: { user_id:userid,status: 3 }  
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
      message: err.message || "Some error occured while retrieving Order Master",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.id;
  Order_master.findByPk(id,{
    include: [
      {
        model: db1.order_detail,
        as: 'ord_detail',
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products'
          },
          {
            model: db1.deal_setup,
            as: 'deal_setups'
          } 
        ]
      },
      {
        model: db1.customers,
        as: 'customers'
      } ,
      {
        model: db1.ord_type_detail,
        as: 'ot_details',
        include: [
          {
            model: db1.order_type,
            as: 'online_ord_type'
          },
        ]
      },
      {
        model: db1.pay_type_detail,
        as: 'pt_details'
      },
      {
        model: db.department_setup,
        as: 'br_so_dept'
      },
      {
        model: db.users,
        as: 'br_so_user'
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
        message: "Error retrieving Order Master with id=" + id,
      });
    });
};

exports.update_done = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.id;

  Order_master.findAll({
    where: { om_id: id },
    })
      .then((data) => {
       if((data[0].ot_de_id ==null) || (data[0].pt_de_id ==null))
       {
          res.status(502).send({
            message: `Order Type Detail Or Payment Type Detail cannot be null`,
          });
       } 
       else
       {
          Order_master.update(req.body, {
            where: { om_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Order Master was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Order Master with id=${id}`,
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

exports.update_prog = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.id;
  Order_master.findAll({
    where: { om_id: id },
    })
      .then((data) => {
       if(data[0].ot_de_id ==null)
       {
          res.status(502).send({
            message: `Order Type Detail cannot be null`,
          });
       } 
       else
       {
          Order_master.update(req.body, {
            where: { om_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Order Master was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Order Master with id=${id}`,
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

exports.unhold_order = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.omid;
  const userid = req.params.userid;
  Order_master.findAll({
    where: { user_id:userid,status: 0 },
    })
      .then((data) => {
       if(data.length ==0)
       {
          Order_master.update(req.body, {
            where: { om_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Order Master was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Order Master with id=${id}`,
              });
            }
          });
       } 
       else
       {
          res.status(502).send({
            message: `Please close the current order`,
          });
       }
        
      })
      .catch((err) => {
           return  res.status(500).send({
          message: err.message || "Some error occurred while retreving the Order Master",
        }); 
  
      }); 
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.id;
  Order_master.destroy({
    where: { om_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Order Master was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Order Master with id=${id}`,
      });
    }
  });
};

exports.findOrder = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  date =new Date().toISOString().slice(0, 10);
  current_date=date.toString();

  Order_master.findAll({
    where:{status:1},
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("om_id")), "total_order"],
      [sequelize.fn("AVG", sequelize.col("net_amount")), "avg_amount"],
      [sequelize.fn("MAX", sequelize.col("net_amount")), "max_amount"],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."om_id") from "order_masters" 
          where date("order_masters"."createdAt") = '${current_date}'
            and "order_masters"."status"='1')`
        ),
        `today_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("order_masters"."net_amount") from "order_masters" 
          where date("order_masters"."createdAt") = '${current_date}'
            and "order_masters"."status"='1')`
        ),
        `today_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."om_id") from "order_masters" 
          where  date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1')`
        ),
        `last30Days_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("order_masters"."net_amount") from "order_masters" 
          where  date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1')`
        ),
        `last30Days_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."cus_id") from "order_masters","customers" 
          where  date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1' 
			    and  "order_masters"."cus_id"="customers"."cus_id" and date("customers"."createdAt")  >= date('${current_date}')- interval '30 days')`
        ),
        `new_order`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."cus_id") from "order_masters","customers" 
          where  date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1' 
			    and  "order_masters"."cus_id"="customers"."cus_id" and date("customers"."createdAt")  <= date('${current_date}')- interval '30 days'
          )`
        ),
        `old_order`,
      ],
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
      message: err.message || "Some error occured while retrieving Order Master",
    });
  });
};
//Select Count(*),to_char(date("order_masters"."createdAt"),'YYYY-MM') as year_month from order_masters  GROUP BY  year_month;
//Select Count(*),to_char(date("order_masters"."createdAt"),'YYYY-MM') as year_month from order_masters where status=1
//GROUP BY  year_month
//ORDER By year_month;
exports.findOrder2 = async (req, res) => {

  var depart = await Department_setup.findByPk(req.params.deptid,{
  });
    if(!depart)
      {
         res.status(500).send({
                 message: "Sorry! Data Not Found With Id=" + req.params.deptid,
            });
      }
      else
      {
        var retailer = await Retailer.findByPk(depart.dataValues.retailer_id)
        if(!retailer)
          {
             res.status(500).send({
                     message: "Sorry! Data Not Found With Id=" + depart.dataValues.retailer_id,
                });
          }
          else
          {
            const ret_db = require("../../individual/models/user");
            req.cur_ret_db=ret_db.getdb(retailer.dataValues.retailer_unique_no)
          }
      }

  const db1=req.cur_ret_db
  const Order_master = db1.order_master;

  const deptid = req.params.deptid;
  date =new Date().toISOString().slice(0, 10);
  current_date=date.toString();

  Order_master.findAll({
    where:{status:1,dept_id:deptid},
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("om_id")), "total_order"],
      [sequelize.fn("AVG", sequelize.col("net_amount")), "avg_amount"],
      [sequelize.fn("MAX", sequelize.col("net_amount")), "max_amount"],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."om_id") from "order_masters" 
          where  date("order_masters"."createdAt") = '${current_date}'
            and "order_masters"."status"='1' and "order_masters"."dept_id"=${deptid})`
        ),
        `today_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("order_masters"."net_amount") from "order_masters" 
          where  date("order_masters"."createdAt") = '${current_date}'
            and "order_masters"."status"='1' and "order_masters"."dept_id"=${deptid})`
        ),
        `today_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."om_id") from "order_masters" 
          where   date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1' and "order_masters"."dept_id"=${deptid})`
        ),
        `last30Days_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("order_masters"."net_amount") from "order_masters" 
          where   date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1' and "order_masters"."dept_id"=${deptid})`
        ),
        `last30Days_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."cus_id") from "order_masters","customers" 
          where   date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1' and "order_masters"."dept_id"=${deptid} 
			    and  "order_masters"."cus_id"="customers"."cus_id" and "customers"."createdAt"  >= date('${current_date}')- interval '30 days')`
        ),
        `new_order`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("order_masters"."cus_id") from "order_masters","customers" 
          where   date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("order_masters"."createdAt")  <=  date('${current_date}') and "order_masters"."status"='1' and "order_masters"."dept_id"=${deptid}
			    and  "order_masters"."cus_id"="customers"."cus_id" and "customers"."createdAt"  <= date('${current_date}')- interval '30 days'
          )`
        ),
        `old_order`,
      ],
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
      message: err.message || "Some error occured while retrieving Order Master",
    });
  });
};

exports.BSO_Report = async (req, res) => {
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
  const Order_master = db1.order_master;

  if(req.body.deptid != '' && req.body.start != '' && req.body.end != '')
  {
    startdate=req.body.start+' 00:00:00.00 +00:00'
    enddate=req.body.end+' 23:59:59.00 +00:00'
    check = 
    {
      createdAt: 
      { 
        [Op.between]: [startdate,enddate] 
      },
      dept_id:req.body.deptid,
      status:1 
    }
  }
  else if(req.body.deptid != '')
  {
    check = 
    {
      dept_id:req.body.deptid,
      status:1 
    }
  }
  else if(req.body.start != '' && req.body.end != '')
  {
    startdate=req.body.start+' 00:00:00.00 +00:00'
    enddate=req.body.end+' 23:59:59.00 +00:00'
    check = 
    {
      createdAt: 
      {
        [Op.between]: [startdate,enddate] 
       
      },
      status:1 
    }
  }
  else
  {
    check = 
    {
      status:1 
    }
  }
  Order_master.findAll({
    where:check,
    include: [
      {
        model: db1.order_detail,
        as: 'ord_detail',
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products',
          },
          {
            model: db1.deal_setup,
            as: 'deal_setups',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_so_dept'
      },
      {
        model:db.users,
        as:'br_so_user'
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
      message: err.message || "Some error occured while retrieving Sale Order Master",
    });
  });
};

exports.update_order = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;
  const Order_detail = db1.order_detail;

  const id = req.params.id;
  const order_master = {
    cancel_reason: req.body.cancel_reason,
    status:req.body.status,
  };
  Order_master.update(order_master, {
    where: { om_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      Order_detail.update({status:req.body.status}, {
        where: { ord_mas_id: id },
      }).then((data1) => {
        if (data1[0] != 0) {
          res.status(200).send({
            message: "Order Master was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update Order Master with id=${id}`,
          });
        }
      });
    } else {
      res.status(500).send({
        message: `Cannot update Order Master with id=${id}`,
      });
    }
  });
    
};

exports.check_inprogress_order = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.on_om_id;
  const userid = req.params.userid;
  Order_master.findAll({
    where: { user_id:userid,status: 0 },
    })
      .then((data) => {
       if(data.length ==0)
       {
          Order_master.findAll({
            where: { on_om_id: id },
          }).then((data) => {
            if (data.length ==0) {
              res.status(200).send({
                message: `This Online Order id=${id} is not assign`,
              });
            } else {
              res.status(502).send({
                message: `This Online Order id=${id} already assigned to Order Master`,
              });
            }
          }); 
       } 
       else
       {
        Order_master.findAll({
          where: { user_id:userid,status:0,on_om_id:id },
          })
            .then((data) => {
              if(data.length ==0)
              {
                res.status(502).send({
                  message: `Please close the current order`,
                });
              }
              else
              {
                res.status(200).send({
                  message: `This Online Order id=${id} is not assign`,
                });
              }
            })
            .catch((err) => {
              return  res.status(500).send({
             message: err.message || "Some error occurred while retreving the Order Master",
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

exports.BO_Report = async (req, res) => {
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
  const Order_master = db1.order_master;

  if(req.body.start != '' && req.body.end != '' && req.body.deptid != '' && req.body.status != '')
  {
    startdate=req.body.start+' 00:00:00.00 +00:00'
    enddate=req.body.end+' 23:59:59.00 +00:00'
    check = 
    {
      createdAt: 
      { 
        [Op.between]: [startdate,enddate] 
      },
      dept_id:req.body.deptid,
      status:req.body.status
    }
  }
  else if(req.body.deptid != '' && req.body.status != '')
  {
    check = 
    {
      dept_id:req.body.deptid,
      status:req.body.status
    }
  }
  else
  {
    res.status(422).send({
      message: "Department or Order type is mendatory",
    });
  }
  Order_master.findAll({
    where:check,
    include: [
      {
        model: db1.order_detail,
        as: 'ord_detail',
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products',
          },
          {
            model: db1.deal_setup,
            as: 'deal_setups',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_so_dept'
      },
      {
        model:db.users,
        as:'br_so_user'
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
      message: err.message || "Some error occured while retrieving Sale Order Master",
    });
  });
};

exports.Discounted_Orders = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  Order_master.findAll({
    where:{status:1,disc_id: { [Op.ne]: 0 },discount: { [Op.ne]: 0 }},
    include: [
      {
        model: db1.order_detail,
        as: 'ord_detail',
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products',
          },
          {
            model: db1.deal_setup,
            as: 'deal_setups',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_so_dept'
      },
      {
        model:db.users,
        as:'br_so_user'
      },
      {
        model: db1.customers,
        as: 'customers'
      },
      {
        model: db1.ord_type_detail,
        as: 'ot_details'
      },
      {
        model: db1.pay_type_detail,
        as: 'pt_details'
      }  

    ],
    order: [
        ['om_id', 'DESC']
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
      message: err.message || "Some error occured while retrieving Sale Order Master",
    });
  });
};

exports.update_order_reason = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  const id = req.params.id;
  const order_master = {
    cancel_reason: req.body.cancel_reason,
  };
  Order_master.update(order_master, {
    where: { om_id: id },
  }).then((data) => {
    if (data[0] != 0) {
        res.status(200).send({
          message: "Order Master was updated successfully",
        });
    } else {
      res.status(500).send({
        message: `Cannot update Order Master with id=${id}`,
      });
    }
  });
    
};

exports.orders_graph = async (req, res) => {
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
    query=`Select Count(*),to_char(date("order_masters"."createdAt"),'YYYY-MM') as year_month from order_masters where status=1
    GROUP BY year_month
    ORDER By year_month`;
  }
  else
  {
    query=`Select Count(*),to_char(date("order_masters"."createdAt"),'YYYY-MM') as year_month from order_masters where status=1 and dept_id=${deptid}
    GROUP BY year_month
    ORDER By year_month`;
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

exports.findcus = async (req, res) => {
  date =new Date().toISOString().slice(0, 10);
  current_date=date.toString();
  const id = req.params.id;
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
 
    query=`SELECT COUNT("order_masters"."cus_id") from "order_masters"
    where   "order_masters"."cus_id" =${id} and date("order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
    and  date("order_masters"."createdAt")  <  date('${current_date}') + interval '30 days' and "order_masters"."status"='1' and "order_masters"."dept_id"=2 
      `;
  
  
  
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


exports.Retailer_completed_order = async (req, res) => {
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
  const Order_master = db1.order_master;

  const deptid = req.body.deptid;
  Order_master.findAll({
    where:{dept_id:deptid,status:1},
    include: [
      {
        model: db1.order_detail,
        as: 'ord_detail',
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products'
          },
          {
            model: db1.deal_setup,
            as: 'deal_setups'
          } 
        ]
      },
      {
        model: db1.customers,
        as: 'customers'
      } ,
      {
        model: db1.ord_type_detail,
        as: 'ot_details',
        include: [
          {
            model: db1.order_type,
            as: 'online_ord_type'
          },
        ]
      },
      {
        model: db1.pay_type_detail,
        as: 'pt_details'
      },
      {
        model: db.department_setup,
        as: 'br_so_dept'
      },
      {
        model: db.users,
        as: 'br_so_user'
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
      message: err.message || "Some error occured while retrieving Order Master",
    });
  });
};