const db = require("../../central/models/user");
const Retailer =db.retailer
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDD': {
     return [ 
        body('start_date', 'start date is required').notEmpty(),
        body('dept_id', 'dept is required').notEmpty(),
        body('dept_id', 'dept value must be in integer').isInt(),
        body('till_id', 'till is required').notEmpty(),
        body('till_id', 'till value must be in integer').isInt(),
        body('till_opening', 'Till opening is required').notEmpty(),
        body('till_opening', 'Till opening value must be in integer').isFloat(),
       ]   
    }
    case 'updateDD': {
      return [ 
         body('close_date', 'Close date is required').notEmpty(),
         body('received', 'received is required').notEmpty(),
         body('received', 'received value must be in integer').isFloat(),
         body('online_sale', 'online sale is required').notEmpty(),
         body('online_sale', 'online sale value must be in integer').isFloat(),
         body('user_id', 'user is required').notEmpty(),
         body('user_id', 'user value must be in integer').isInt(),
         body('day_close', 'day close is required').notEmpty(),
         body('day_close', 'day close value must be in integer').isInt(),
         body('active', 'active is required').notEmpty(),
         body('active', 'active value must be in integer').isInt(),
         body('till_close', 'Till Closing is required').notEmpty(),
         body('till_close', 'Till Closing value must be in integer').isFloat(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Daily_days = db1.daily_days;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const daily_days = {
        start_date: req.body.start_date,
        dept_id: req.body.dept_id,
        till_id: req.body.till_id,
        till_opening: req.body.till_opening,
        received: req.body.received,
        online_sale: req.body.online_sale,
        cash_return: req.body.cash_return,
        till_close: req.body.till_close,
        close_date: req.body.close_date,
        day_close: 0,
        user_id: req.body.user_id,
        active:'1',
      };
      Daily_days.findAll({
        where:{till_id: req.body.till_id,active:1}
      })
      .then((data) => {
        if(!data.length)
        {
          Daily_days.create(daily_days)
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
  const Daily_days = db1.daily_days;

  const id = req.params.id;
    Daily_days.findAll({
      where:{dept_id:id}
    ,
      include: [
          {
            model: db1.till_setup,
            as: 'till_setup'
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
        message: err.message || "Some error occured while retrieving Daily days",
      });
    });
};

exports.findActive = (req, res) => {
  const db1=req.ret_db
  const Daily_days = db1.daily_days;

  const id = req.params.id;
    Daily_days.findAll({
      where:{dept_id:id, active:1, day_close:0}
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
        message: err.message || "Some error occured while retrieving Daily days",
      });
    });
};

// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   Daily_days.findAll({
//     where:{day_id:id},
//     // include: [
//     //   {
//     //     model: db.mart_ord_mas,
//     //     as: 'day',
//     //     attributes: [[sequelize.fn('SUM', sequelize.col('net_total')), 'sale'],]
//     //   }
//     // ]
//     attributes: [[sequelize.fn('SUM', sequelize.col('till_opening')), 'opening'],
    
//   [sequelize.literal(`(SELECT SUM("mart_order_masters"."net_total") from "mart_order_masters" where "mart_order_masters"."day_id"=${id} and "mart_order_masters"."status"=1)`),`sale`],
// ]
// })
//     .then((data) => {
//       if(!data)
//         {
//            res.status(500).send({
//                    message: "Sorry! Data Not Found With Id=" + id,
//               });
//         }
//         else
//         {
//            res.status(200).send(data);
//         }
//     })
//     .catch((err) => {
//       res.status(502).send({
//         message: "Error retrieving Daily days with id=" + id,
//       });
//     });
// };
exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Daily_days = db1.daily_days;

  Daily_days.findAll({
    where : {day_id:req.params.id},
    attributes: [['day_id','day_id'],['till_opening','opening'],['start_date','open_date'],
    [sequelize.literal(`(SELECT SUM("mom"."net_amount") from "mart_order_masters" as mom join payment_type_details as ptd on "ptd"."pt_d_id"="mom"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "mom"."day_id"=${req.params.id} and "mom"."status"=1 and "pt"."p_type_name"='Cash')`),`MartCashsale`],
    [sequelize.literal(`(SELECT SUM("mom"."net_amount") from "mart_order_masters" as mom join payment_type_details as ptd on "ptd"."pt_d_id"="mom"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "mom"."day_id"=${req.params.id} and "mom"."status"=1 and "pt"."p_type_name"!='Cash')`),`MartOnlinesale`],
    [sequelize.literal(`(SELECT SUM("ord"."net_amount") from "order_masters" as ord join payment_type_details as ptd on "ptd"."pt_d_id"="ord"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "ord"."day_id"=${req.params.id} and "ord"."status"=1 and "pt"."p_type_name"='Cash')`),`ResCashSale`],
    [sequelize.literal(`(SELECT SUM("ord"."net_amount") from "order_masters" as ord join payment_type_details as ptd on "ptd"."pt_d_id"="ord"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "ord"."day_id"=${req.params.id} and "ord"."status"=1 and "pt"."p_type_name"!='Cash')`),`ResOnlineSale`]

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
      console.log(data[0].dataValues)
data[0].dataValues.MartCashsale=data[0].dataValues.MartCashsale!=null?data[0].dataValues.MartCashsale:0.0
data[0].dataValues.MartOnlinesale=data[0].dataValues.MartOnlinesale!=null?data[0].dataValues.MartOnlinesale:0.0
data[0].dataValues.ResCashSale=data[0].dataValues.ResCashSale!=null?data[0].dataValues.ResCashSale:0.0
data[0].dataValues.ResOnlineSale=data[0].dataValues.ResOnlineSale!=null?data[0].dataValues.ResOnlineSale:0.0
           console.log(data[0].dataValues)

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
  const Daily_days = db1.daily_days;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Daily_days.update(req.body, {
      where: { day_id: id },
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
  const Daily_days = db1.daily_days;

  const id = req.params.id;
  Daily_days.destroy({
    where: { day_id: id },
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

exports.DDReport = async (req, res) => {
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
  const Daily_days = db1.daily_days;

  if(req.body.deptid==undefined || req.body.deptid=='')
  {
    res.status(422).send({
      message: "Department cannot be null",
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
          dept_id:req.body.deptid,
          day_close:1 
        }
      }
      else
      {
        check = 
        {
          dept_id:req.body.deptid,
          day_close:1 
        }
      }
    Daily_days.findAll({
      where:check,
      include: [
          {
            model: db1.till_setup,
            as: 'till_setup',
            attributes:['till_id','till_name']
          },
          {
            model: db.department_setup,
            as: 'dd_dept',
            attributes:['dept_id','dept_name']
          },
          {
            model: db.users,
            as: 'dd_user',
            attributes:['user_id','user_name']
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
        message: err.message || "Some error occured while retrieving Daily days",
      });
    });
  }
};

exports.Retailer_DD = async (req, res) => {
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
  const Daily_days = db1.daily_days;

  const id = req.body.deptid;
    Daily_days.findAll({
      where:{dept_id:id}
    ,
    include: [
      {
        model: db1.till_setup,
        as: 'till_setup',
        attributes:['till_id','till_name']
      },
      {
        model: db.department_setup,
        as: 'dd_dept',
        attributes:['dept_id','dept_name']
      },
      {
        model: db.users,
        as: 'dd_user',
        attributes:['user_id','user_name']
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
        message: err.message || "Some error occured while retrieving Daily days",
      });
    });
};