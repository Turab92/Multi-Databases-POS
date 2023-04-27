const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require('sequelize');
const Op = sequelize.Op;
var moment = require('moment');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDS': {
     return [ 
        body('start_time', 'start time is required').notEmpty(),
        body('dept_id', 'Dept id is required').notEmpty(),
        body('dept_id', 'Dept id value must be in integer').isInt(),
        body('day_id', 'Day id is required').notEmpty(),
        body('day_id', 'Day id value must be in integer').isInt(),
        body('shift_opening_amt', 'Shift opening amount is required').notEmpty(),
        body('shift_opening_amt', 'Shift opening amount value must be in integer').isFloat(),
       ]   
    }
    case 'updateDS': {
      return [ 
         body('close_time', 'Close time is required').notEmpty(),
         body('cash_received', 'cash received is required').notEmpty(),
         body('cash_received', 'cash received value must be in integer').isFloat(),
         body('online_sale', 'online sale is required').notEmpty(),
         body('online_sale', 'online sale value must be in integer').isFloat(),
         body('user_id', 'user is required').notEmpty(),
         body('user_id', 'user value must be in integer').isInt(),
         body('shift_close', 'Shift close is required').notEmpty(),
         body('shift_close', 'Shift close value must be in integer').isInt(),
         body('active', 'active is required').notEmpty(),
         body('active', 'active value must be in integer').isInt(),
         body('shift_close_amt', 'Shift Closing amount is required').notEmpty(),
         body('shift_close_amt', 'Shift Closing amount value must be in integer').isFloat(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Day_shifts = db1.day_shifts;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const day_shifts = {
        start_time: req.body.start_time,
        dept_id: req.body.dept_id,
        day_id: req.body.day_id,
        shift_opening_amt: req.body.shift_opening_amt,
        cash_received: req.body.cash_received,
        online_sale: req.body.online_sale,
        cash_return: req.body.cash_return,
        shift_close_amt: req.body.shift_close_amt,
        close_time: req.body.close_time,
        shift_close: 0,
        user_id: req.body.user_id,
        active:'1',
      };
      Day_shifts.findAll({
        where:{day_id: req.body.day_id,active:1}
      })
      .then((data) => {
        if(!data.length)
        {
          Day_shifts.create(day_shifts)
          .then((data) => {
          res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Day Shift",
            });
          });
          
        }
        else
        {
          res.status(501).send({
            message: "Please Close The Previous Shift",
      });
        }
        })
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Day_shifts = db1.day_shifts;

  const id = req.params.id;
    Day_shifts.findAll({
      where:{dept_id:id}
    ,
      include: [
          {
            model: db1.daily_days,
            as: 'all_shifts',
            include: [
              {
                model: db1.till_setup,
                as: 'till_setup'
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
        message: err.message || "Some error occured while retrieving Day Shift",
      });
    });
};

// exports.findOne = (req, res) => {
//   const id = req.params.id;
//   Day_shifts.findAll({
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
//         message: "Error retrieving Day Shift with id=" + id,
//       });
//     });
// };
exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Day_shifts = db1.day_shifts;

  Day_shifts.findAll({
    where : {shift_id:req.params.id},
    attributes: [['shift_id','shift_id'],['shift_opening_amt','opening'],['start_time','open_time'],
    [sequelize.literal(`(SELECT SUM("mom"."net_amount") from "mart_order_masters" as mom join payment_type_details as ptd on "ptd"."pt_d_id"="mom"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "mom"."shift_id"=${req.params.id} and "mom"."status"=1 and "pt"."p_type_name"='Cash')`),`MartCashsale`],
    [sequelize.literal(`(SELECT SUM("mom"."net_amount") from "mart_order_masters" as mom join payment_type_details as ptd on "ptd"."pt_d_id"="mom"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "mom"."shift_id"=${req.params.id} and "mom"."status"=1 and "pt"."p_type_name"!='Cash')`),`MartOnlinesale`],
    [sequelize.literal(`(SELECT SUM("ord"."net_amount") from "order_masters" as ord join payment_type_details as ptd on "ptd"."pt_d_id"="ord"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "ord"."shift_id"=${req.params.id} and "ord"."status"=1 and "pt"."p_type_name"='Cash')`),`ResCashSale`],
    [sequelize.literal(`(SELECT SUM("ord"."net_amount") from "order_masters" as ord join payment_type_details as ptd on "ptd"."pt_d_id"="ord"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "ord"."shift_id"=${req.params.id} and "ord"."status"=1 and "pt"."p_type_name"!='Cash')`),`ResOnlineSale`]

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
      data[0].dataValues.MartCashsale=data[0].dataValues.MartCashsale!=null?data[0].dataValues.MartCashsale:0.0
      data[0].dataValues.MartOnlinesale=data[0].dataValues.MartOnlinesale!=null?data[0].dataValues.MartOnlinesale:0.0
      data[0].dataValues.ResCashSale=data[0].dataValues.ResCashSale!=null?data[0].dataValues.ResCashSale:0.0
      data[0].dataValues.ResOnlineSale=data[0].dataValues.ResOnlineSale!=null?data[0].dataValues.ResOnlineSale:0.0
       res.send({"data":data});
    }
  })
  .catch((err) => {
    res.status(502).send({
      message: err.message || "Error retrieving Day Shift with id=" + req.params.id,
    });
  });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Day_shifts = db1.day_shifts;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Day_shifts.update(req.body, {
      where: { shift_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Day Shift was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Day Shift with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Day_shifts = db1.day_shifts;

  const id = req.params.id;
  Day_shifts.destroy({
    where: { shift_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Day Shift was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Day Shift with id=${id}`,
      });
    }
  });
};

// exports.DDReport = (req, res) => {
//   if(req.body.deptid==undefined || req.body.deptid=='')
//   {
//     res.status(422).send({
//       message: "Department cannot be null",
//     });
//   }
//   else
//   {
//     if(req.body.start != '' && req.body.end != '')
//       {
//         startdate=req.body.start+' 00:00:00.00 +00:00'
//         enddate=req.body.end+' 23:59:59.00 +00:00'
//         check = 
//         {
//           createdAt: 
//           {
//             [Op.between]: [startdate,enddate] 
          
//           },
//           dept_id:req.body.deptid,
//           day_close:1 
//         }
//       }
//       else
//       {
//         check = 
//         {
//           dept_id:req.body.deptid,
//           day_close:1 
//         }
//       }
//     Day_shifts.findAll({
//       where:check,
//       include: [
//           {
//             model: db.till_setup,
//             as: 'till_setup',
//             attributes:['till_id','till_name']
//           },
//           {
//             model: db.department_setup,
//             as: 'dd_dept',
//             attributes:['dept_id','dept_name']
//           },
//           {
//             model: db.users,
//             as: 'dd_user',
//             attributes:['user_id','user_name']
//           }
//         ]
//     })
//     .then((data) => {
      
//       if(!data.length)
//       {
//          res.status(500).send({
//                  message: "Data Not Found",
//             });
//       }
//       else
//       {
//          res.status(200).send(data);
//       }
//     })
//     .catch((err) => {
//       res.status(502).send({
//         message: err.message || "Some error occured while retrieving Day Shift",
//       });
//     });
//   }
// };


exports.Retailer_DS = async (req, res) => {
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
  const Day_shifts = db1.day_shifts;

  const id = req.body.deptid;
    Day_shifts.findAll({
      where:{dept_id:id},
      include: [
          {
            model: db1.daily_days,
            as: 'all_shifts',
            include: [
              {
                model: db.department_setup,
                as: 'dd_dept',
                attributes:['dept_id','dept_name']
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
        message: err.message || "Some error occured while retrieving Day Shift",
      });
    });
};

exports.shift_close_update = (req, res) => {
  const db1=req.ret_db
  const Day_shifts = db1.day_shifts;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    Day_shifts.findAll({
      where : {shift_id:id},
      attributes: [['shift_id','shift_id'],['shift_opening_amt','opening'],['start_time','open_time'],
      [sequelize.literal(`(SELECT SUM("mom"."net_amount") from "mart_order_masters" as mom join payment_type_details as ptd on "ptd"."pt_d_id"="mom"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "mom"."shift_id"=${id} and "mom"."status"=1 and "pt"."p_type_name"='Cash')`),`MartCashsale`],
      [sequelize.literal(`(SELECT SUM("mom"."net_amount") from "mart_order_masters" as mom join payment_type_details as ptd on "ptd"."pt_d_id"="mom"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "mom"."shift_id"=${id} and "mom"."status"=1 and "pt"."p_type_name"!='Cash')`),`MartOnlinesale`],
      [sequelize.literal(`(SELECT SUM("ord"."net_amount") from "order_masters" as ord join payment_type_details as ptd on "ptd"."pt_d_id"="ord"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "ord"."shift_id"=${id} and "ord"."status"=1 and "pt"."p_type_name"='Cash')`),`ResCashSale`],
      [sequelize.literal(`(SELECT SUM("ord"."net_amount") from "order_masters" as ord join payment_type_details as ptd on "ptd"."pt_d_id"="ord"."pt_de_id" join payment_types as pt on "ptd"."pay_type_id"="pt"."p_type_id"  where "ord"."shift_id"=${id} and "ord"."status"=1 and "pt"."p_type_name"!='Cash')`),`ResOnlineSale`]
  
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
        mart_cash =data[0].dataValues.MartCashsale!=null?data[0].dataValues.MartCashsale:0.0
        mart_online =data[0].dataValues.MartOnlinesale!=null?data[0].dataValues.MartOnlinesale:0.0
        rest_cash = data[0].dataValues.ResCashSale!=null?data[0].dataValues.ResCashSale:0.0
        rest_online = data[0].dataValues.ResOnlineSale!=null?data[0].dataValues.ResOnlineSale:0.0

        var received = parseFloat(mart_cash + rest_cash + data[0].dataValues.shift_opening_amt);
        var cash = parseFloat(mart_cash + rest_cash);
        var online = parseFloat(mart_online + rest_online);
        var cur_time= moment().format("HH:mm");
        const day_shifts = {
          cash_received: cash,
          online_sale: online,
          cash_return: req.body.cash_return,
          shift_close_amt: received,
          close_time: cur_time,
          shift_close: 1,
          user_id: req.body.user_id,
          active:0,
        };

        Day_shifts.update(day_shifts, {
          where: { shift_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Day Shift was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Day Shift with id=${id}`,
            });
          }
        });
        
      }
    })
  }
};