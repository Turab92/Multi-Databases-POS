const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createPNL': {
        return [ 
            body('dept_id', 'dept_id is required').notEmpty(),
            body('dept_id', 'dept_id value must be in integer').isInt(),
            body('start_date', 'start_date is required').notEmpty(),
            body('start_date', 'start_date value must be in date formit').isDate(),
            body('end_date', 'end_date is required').notEmpty(),
            body('end_date', 'end_date value must be in date formit').isDate(),
            body('user_id', 'user_id is required').notEmpty(),
            body('user_id', 'user_id value must be in integer').isInt(),
        ]   
    }
    case 'updatePNL': {
        return [ 
            body('dept_id', 'dept_id is required').notEmpty(),
            body('dept_id', 'dept_id value must be in integer').isInt(),
            body('start_date', 'start_date is required').notEmpty(),
            body('start_date', 'start_date value must be in date formit').isDate(),
            body('end_date', 'end_date is required').notEmpty(),
            body('end_date', 'end_date value must be in date formit').isDate(),
            body('user_id', 'user_id is required').notEmpty(),
            body('user_id', 'user_id value must be in integer').isInt(),
            body('status', 'Status is required').notEmpty(),
            body('status', 'Status value must be in integer').isInt(),
            ]   
        }
  }
}

exports.create = async (req, res) => {
  const db1=req.ret_db
  const PNL = db1.pnl;
  const Mart_ord_mas = db1.mart_ord_mas;
  const Expense_out = db1.expense_out;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    startdate=req.body.start_date+' 00:00:00.00 +00:00'
    enddate=req.body.end_date+' 23:59:59.00 +00:00'

    total_sale=0
    total_sale_amt=0
    total_expense=0
    total_expense_amt=0
    pnl_amt=0
    is_in_profit=0
    var data = await Mart_ord_mas.findAll({
      where: {
          createdAt: 
          {
            [Op.between]: [startdate,enddate] 
          },
          dept_id:req.body.dept_id,
          status:1 
      }
      });
        if(!data.length)
            {
              res.status(500).send({
                  message: "Sale Data Not Found",
              });
            }
            else
            {
                for(var d of data){
                  console.log(d.dataValues.net_amount)
                    total_sale_amt += parseFloat(d.dataValues.net_amount)
                    total_sale += 1
                } 
                var data1 = await Expense_out.findAll({
                    where: {
                        createdAt: 
                        {
                          [Op.between]: [startdate,enddate] 
                        },
                        dept_id:req.body.dept_id,
                        status:1 
                    }
                    })
                      if(!data1.length)
                       {
                          res.status(500).send({
                            message: "Expense Out Data Not Found",
                          });
                       }
                       else
                       {
                          for(var d of data1){
                            total_expense_amt +=  parseFloat(d.dataValues.expense_amount)
                            total_expense += 1
                          } 
                       

                       pnl_amt= total_sale_amt - total_expense_amt

                       if(pnl_amt>0){
                        is_in_profit=1
                       }
                       else if(pnl_amt<0){
                        is_in_profit=-1
                       }
                       else{
                        is_in_profit=0
                       }
            
            let today = new Date();//returndate
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var date3 = yyyy + '-' + mm + '-' + dd;
            let date2 = new Date(date3);

            const pnl = {
                dept_id: req.body.dept_id,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                total_sale: total_sale,
                total_expense: total_expense,
                pnl_gen_date: date2,
                total_sale_amt: total_sale_amt,
                total_expense_amt: total_expense_amt,
                pnl_amount: pnl_amt,
                is_in_profit: is_in_profit,
                user_id: req.body.created_by,
                status: 1
            };

                PNL.create(pnl)
                .then((data) => {
                res.status(200).send(data);
                })
                .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while create the PNL",
                });
                });       
      }
    }
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const PNL = db1.pnl;

    PNL.findAll({
      where:{dept_id:req.params.deptid}
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving PNL",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAllActive = (req, res) => {
  const db1=req.ret_db
  const PNL = db1.pnl;

  PNL.findAll({
    where:{status:1,dept_id:req.params.deptid}
  })//findAll return array
  .then((data) => {
      if(!data.length)
      {
         res.status(500).send({
                 message: "Some error occured while retrieving PNL",
            });
      }
      else
      {
         res.status(200).send(data[0]);
      }
  })
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const PNL = db1.pnl;

  const id = req.params.id;
  PNL.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving PNL with id=" + id,
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
  const PNL = db1.pnl;

    const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      PNL.update(req.body, {
        where: { pnl_det_id: id },
      }).then((data) => {
        if (data[0] != 0) {
          res.status(200).send({
            message: "PNL was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update PNL with id=${id}`,
          });
        }
      });
    }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const PNL = db1.pnl;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  PNL.destroy({
    where: { pnl_det_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "PNL was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete PNL with id=${id}`,
      });
    }
  });
};

exports.BPNL_Report = async (req, res) => {
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
  const PNL = db1.pnl;

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
  PNL.findAll({
    where:check,
    include: [
      {
        model:db.department_setup,
        as:'dept_pnl'
      },
      {
        model:db.users,
        as:'created_by_pnl'
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
      message: err.message || "Some error occured while retrieving PNL",
    });
  });
};

exports.Retailer_pnl = async (req, res) => {
  var retailer = await Retailer.findByPk(req.params.retailer_id)
  if(!retailer)
    {
       res.status(500).send({
               message: "Sorry! Data Not Found With Id=" + req.params.retailer_id,
          });
    }
    else
    {
      const ret_db = require("../../individual/models/user");
      req.cur_ret_db=ret_db.getdb(retailer.dataValues.retailer_unique_no)
    }
  const db1=req.cur_ret_db
  const PNL = db1.pnl;

    PNL.findAll({
      include: [
        {
          model:db.department_setup,
          as:'dept_pnl'
        },
        {
          model:db.users,
          as:'created_by_pnl'
        }
  
      ]
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving PNL",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

