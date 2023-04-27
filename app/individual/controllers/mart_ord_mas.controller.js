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
//   let mat_cat_id = req.params.mat_cat_id;
//   const mart_ord_mas = {
//     dept_id: req.body.dept_id,
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
//     net_amount: req.body.net_amount,
//     cash_received: req.body.cash_received,
//     cancel_reason: req.body.cancel_reason,
//     status:'0',
//   };

//     Mart_ord_mas.findAll({
//       where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
//       })
//         .then((data) => {
         
//          if(data.length == 0 )
//          {
          
//           Mart_ord_mas.create(mart_ord_mas)
//           .then((data) => {
//               return res.redirect('/add_mart_ord_det/'+data.m_om_id+'/'+mat_cat_id+'/'+req.body.material_id+'/'+req.body.dept_id)
//           })
//           .catch((err) => {
//              return  res.status(500).send({
//               message: err.message || "Some error occurred while create the Order Master",
//             });
//           });
          
//          } 
//          else
//          {
         
//           return res.redirect('/add_mart_ord_det/'+data[0].m_om_id+'/'+mat_cat_id+'/'+req.body.material_id+'/'+req.body.dept_id)
//          }
          
//         })
//         .catch((err) => {
//              return  res.status(500).send({
//             message: err.message || "Some error occurred while create the Order Master",
//           }); 
    
//         });  
// };

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

    Mart_ord_mas.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Mart Order Master",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  const id = req.params.id;
  Mart_ord_mas.findAll({
    where:{m_om_id:id,status:1},
    include: [
      {
        model: db1.mart_ord_det,
        as: 'mart_ord_detail',
        include: [
          {
            model: db1.raw_mat_cat,
            as: 'ord_mat_cat'
          }
        ]
      },
      {
        model: db1.customers,
        as: 'mart_customers'
      }  
    ]
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(500).send({
                   message: "Sorry! Data Not Found With Id=" + id,
              });
        }
        else
        {
           res.status(200).send(data[0]);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Order Master with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
  Mart_ord_mas.update(req.body, {
    where: { m_om_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Mart Order Master was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Mart Order Master with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Mart_ord_mas.destroy({
    where: { m_om_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Mart Order Master was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Mart Order Master with id=${id}`,
      });
    }
  });
};

exports.findMartHolds = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  let userid = req.params.id;
  Mart_ord_mas.findAll({
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

exports.findOD = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  let omid = req.params.id;
  Mart_ord_mas.findAll({
    where: {  m_om_id: omid },
      include: [
        {
          model: db1.ord_type_detail,
          as: 'm_ot_details'
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

exports.findPD = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  let omid = req.params.id;
  Mart_ord_mas.findAll({
    where: {  m_om_id: omid },
      include: [
        {
          model: db1.pay_type_detail,
          as: 'mart_pt_details'
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
        message: err.message || "Some error occured while retrieving payment type detail",
      });
    });
};
exports.update_prog = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  const id = req.params.id;
  Mart_ord_mas.findAll({
    where: { m_om_id: id },
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
          Mart_ord_mas.update(req.body, {
            where: { m_om_id: id },
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
  const Mart_ord_mas = db1.mart_ord_mas;

  const id = req.params.omid;
  const userid = req.params.userid;
  Mart_ord_mas.findAll({
    where: { user_id:userid,status: 0 },
    })
      .then((data) => {
       if(data.length ==0)
       {
        Mart_ord_mas.update(req.body, {
            where: { m_om_id: id },
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
exports.update_done = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  const id = req.params.id;
  Mart_ord_mas.findAll({
    where: { m_om_id: id },
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
          Mart_ord_mas.update(req.body, {
            where: { m_om_id: id },
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

exports.findOrder = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  date =new Date().toISOString().slice(0, 10);
  current_date=date.toString();

  Mart_ord_mas.findAll({
    where:{status:1},
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("m_om_id")), "total_order"],
      [sequelize.fn("AVG", sequelize.col("net_amount")), "avg_amount"],
      [sequelize.fn("MAX", sequelize.col("net_amount")), "max_amount"],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."m_om_id") from "mart_order_masters" 
          where date("mart_order_masters"."createdAt") = '${current_date}'
            and "mart_order_masters"."status"='1')`
        ),
        `today_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("mart_order_masters"."net_amount") from "mart_order_masters" 
          where date("mart_order_masters"."createdAt") = '${current_date}'
            and "mart_order_masters"."status"='1')`
        ),
        `today_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."m_om_id") from "mart_order_masters" 
          where  date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}') and "mart_order_masters"."status"='1')`
        ),
        `last30Days_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("mart_order_masters"."net_amount") from "mart_order_masters" 
          where  date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}') and "mart_order_masters"."status"='1')`
        ),
        `last30Days_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."cus_id") from "mart_order_masters","customers" 
          where  date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}') and "mart_order_masters"."status"='1' 
			    and  "mart_order_masters"."cus_id"="customers"."cus_id" and date("customers"."createdAt")  >= date('${current_date}')- interval '30 days')`
        ),
        `new_order`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."cus_id") from "mart_order_masters","customers" 
          where  date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}') and "mart_order_masters"."status"='1' 
			    and  "mart_order_masters"."cus_id"="customers"."cus_id" and date("customers"."createdAt")  <= date('${current_date}')- interval '30 days'
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
//Select Count(*),to_char(date("mart_order_masters"."createdAt"),'YYYY-MM') as year_month from mart_order_masters  GROUP BY  year_month;
//Select Count(*),to_char(date("mart_order_masters"."createdAt"),'YYYY-MM') as year_month from mart_order_masters where status=1
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
      const Mart_ord_mas = db1.mart_ord_mas;

  const deptid = req.params.deptid;
  date =new Date().toISOString().slice(0, 10);
  current_date=date.toString();

  Mart_ord_mas.findAll({
    where:{status:1,dept_id:deptid},
    attributes: [
      [sequelize.fn("COUNT", sequelize.col("m_om_id")), "total_order"],
      [sequelize.fn("AVG", sequelize.col("net_amount")), "avg_amount"],
      [sequelize.fn("MAX", sequelize.col("net_amount")), "max_amount"],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."m_om_id") from "mart_order_masters" 
          where  date("mart_order_masters"."createdAt") = '${current_date}'
            and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=${deptid})`
        ),
        `today_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("mart_order_masters"."net_amount") from "mart_order_masters" 
          where  date("mart_order_masters"."createdAt") = '${current_date}'
            and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=${deptid})`
        ),
        `today_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."m_om_id") from "mart_order_masters" 
          where   date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}') and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=${deptid})`
        ),
        `last30Days_order`,
      ],
      [
        sequelize.literal(
          `(SELECT SUM("mart_order_masters"."net_amount") from "mart_order_masters" 
          where   date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}') and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=${deptid})`
        ),
        `last30Days_sale`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."cus_id") from "mart_order_masters","customers" 
          where   date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}')  and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=${deptid} 
			    and  "mart_order_masters"."cus_id"="customers"."cus_id" and "customers"."createdAt"  >= date('${current_date}')- interval '30 days')`
        ),
        `new_order`,
      ],
      [
        sequelize.literal(
          `(SELECT COUNT("mart_order_masters"."cus_id") from "mart_order_masters","customers" 
          where   date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
          and  date("mart_order_masters"."createdAt")  <=  date('${current_date}')  and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=${deptid}
			    and  "mart_order_masters"."cus_id"="customers"."cus_id" and "customers"."createdAt"  <= date('${current_date}')- interval '30 days'
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
  const Mart_ord_mas = db1.mart_ord_mas;

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
  Mart_ord_mas.findAll({
    where:check,
    include: [
      {
        model: db1.mart_ord_det,
        as: 'mart_ord_detail',
        include: [
          {
            model: db.raw_material,
            as: 'ord_raw',
          },
          {
            model: db1.raw_mat_cat,
            as: 'ord_mat_cat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_so_mart_dept'
      },
      {
        model:db.users,
        as:'br_so_mart_user'
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
  const Mart_ord_mas = db1.mart_ord_mas;

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
  Mart_ord_mas.findAll({
    where:check,
    include: [
      {
        model: db1.mart_ord_det,
        as: 'mart_ord_detail',
        include: [
          {
            model: db.raw_material,
            as: 'ord_raw',
          },
          {
            model: db1.raw_mat_cat,
            as: 'ord_mat_cat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_so_mart_dept'
      },
      {
        model:db.users,
        as:'br_so_mart_user'
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
    query=`Select Count(*),to_char(date("mart_order_masters"."createdAt"),'YYYY-MM') as year_month from mart_order_masters where status=1
    GROUP BY year_month
    ORDER By year_month`;
  }
  else
  {
    query=`Select Count(*),to_char(date("mart_order_masters"."createdAt"),'YYYY-MM') as year_month from mart_order_masters where status=1 and dept_id=${deptid}
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
 
    query=`SELECT COUNT("mart_order_masters"."cus_id") from "mart_order_masters"
    where   "mart_order_masters"."cus_id" =${id} and date("mart_order_masters"."createdAt")  >= date('${current_date}')- interval '30 days'
    and  date("mart_order_masters"."createdAt")  <  date('${current_date}') + interval '30 days' and "mart_order_masters"."status"='1' and "mart_order_masters"."dept_id"=2 
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
