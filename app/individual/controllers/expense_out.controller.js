const db = require("../../central/models/user");
const Retailer = db.retailer;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createExpenseOut': {
     return [ 
        body('dept_id', 'dept_id is required').notEmpty(),
        body('dept_id', 'dept_id value must be in integer').isInt(),
        body('expense_id', 'expense_id is required').notEmpty(),
        body('expense_id', 'expense_id value must be in integer').isInt(),
        body('expense_amount', 'expense_amount is required').notEmpty(),
        body('expense_amount', 'expense_amount value must be in integer').isFloat(),
        body('exp_paid_date', 'Expense paid date is required').notEmpty(),
        body('exp_paid_date', 'Expense paid date value must be in date format').isDate(),
        body('payment_type', 'Payment type is required').notEmpty(),
        body('user_id', 'Created by user is required').notEmpty(),
        body('user_id', 'Created by user value must be in date format').isInt(),
       ]   
    }
    case 'updateExpenseOut': {
      return [ 
        body('dept_id', 'dept_id is required').notEmpty(),
        body('dept_id', 'dept_id value must be in integer').isInt(),
        body('expense_id', 'expense_id is required').notEmpty(),
        body('expense_id', 'expense_id value must be in integer').isInt(),
        body('expense_amount', 'expense_amount is required').notEmpty(),
        body('expense_amount', 'expense_amount value must be in integer').isFloat(),
        body('exp_paid_date', 'Expense paid date is required').notEmpty(),
        body('exp_paid_date', 'Expense paid date value must be in date format').isDate(),
        body('payment_type', 'Payment type is required').notEmpty(),
        body('status', 'status is required').notEmpty(),
        body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Expense_out = db1.expense_out;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  var error =[];
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    if (req.file == undefined) {
      res.status(400).send({
        message: "Paid Invoice image can not be empty !",
      });
      return;
    }
    
      else{
            var path = req.protocol+ '://' + req.get('Host') + '/public/paid_invoice_image/' + req.file.filename;
            if(req.file.mimetype != 'image/jpeg' && req.file.mimetype != 'image/jpg' && req.file.mimetype != 'image/png')
              {
                  error.push( "Image type must be jpg, png, jpeg!");  
              }
              if(error.length!=0){
                if (req.file != undefined) {
                  fs.unlinkSync('public/paid_invoice_image/' + req.file.filename)
                }
                
                res.status(203).send(error);
              }
              else
              {
                const expense_out = {
                  dept_id: req.body.dept_id,
                  expense_id: req.body.expense_id,
                  expense_amount: req.body.expense_amount,
                  exp_paid_date: req.body.exp_paid_date,
                  payment_type: req.body.payment_type,
                  user_id: req.body.created_by,
                  paid_invoice_no: req.body.paid_invoice_no,
                  paid_invoice_img: path,
                  status:1,
                };
              
                  Expense_out.create(expense_out)
                  .then((data) => {
                  res.status(200).send(data);
                  })
                  .catch((err) => {
                      res.status(500).send({
                      message: err.message || "Some error occurred while create the Expense_out",
                      });
                  });
              }
      }       
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Expense_out = db1.expense_out;

    Expense_out.findAll({
      where:{status:1,dept_id:req.params.deptid},
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
        message: err.message || "Some error occured while retrieving Expense_out",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Expense_out = db1.expense_out;

  Expense_out.findAll({
    where:{dept_id:req.params.deptid}
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
      message: err.message || "Some error occured while retrieving Expense_out",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Expense_out = db1.expense_out;

  const id = req.params.id;
  Expense_out.findByPk(id)
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
        message: "Error retrieving Expense_out with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Expense_out = db1.expense_out;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    if (req.file == undefined) {
            Expense_out.update(req.body, {
            where: { exp_out_id: id },
            }).then((data) => {
            if (data[0] != 0) {
                res.status(200).send({
                message: "Expense_out was updated successfully",
                });
            } else {
                res.status(500).send({
                message: `Cannot update Expense_out with id=${id}`,
                });
            }
            });
        }
        else{
            var path = req.protocol+ '://' + req.get('Host') + '/public/paid_invoice_image/' + req.file.filename;
            if(req.files.paid_invoice_img[0].mimetype != 'image/jpeg' && req.files.paid_invoice_img[0].mimetype != 'image/jpg' && req.files.paid_invoice_img[0].mimetype != 'image/png')
              {
                  error.push( "Image type must be jpg, png, jpeg!");  
              }
              if(error.length!=0){
                if (req.files.paid_invoice_img != undefined) {
                  fs.unlinkSync('public/paid_invoice_image/' + req.files.paid_invoice_img[0].filename)
                }
                
                res.status(203).send(error);
              }
              else
              {
                const expense_out = {
                  dept_id: req.body.dept_id,
                  expense_id: req.body.expense_id,
                  expense_amount: req.body.expense_amount,
                  exp_paid_date: req.body.exp_paid_date,
                  payment_type: req.body.payment_type,
                  paid_invoice_no: req.body.paid_invoice_no,
                  paid_invoice_img: path,
                  status:req.body.status,
                };
                Expense_out.update(expense_out, {
                    where: { exp_out_id: id },
                    }).then((data) => {
                    if (data[0] != 0) {
                        res.status(200).send({
                        message: "Expense_out was updated successfully",
                        });
                    } else {
                        res.status(500).send({
                        message: `Cannot update Expense_out with id=${id}`,
                        });
                    }
                    });
              }
        }
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Expense_out = db1.expense_out;

  const id = req.params.id;
  Expense_out.destroy({
    where: { exp_out_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Expense_out was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Expense_out with id=${id}`,
      });
    }
  });
};

exports.BEO_Report = async (req, res) => {
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
  const Expense_out = db1.expense_out;

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
  Expense_out.findAll({
    where:check,
    include: [
      {
        model:db1.expense_setup,
        as:'exp_out'
      },
      {
        model:db.users,
        as:'expense_out_user'
      },
      {
        model:db.department_setup,
        as:'dept_exp_out'
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
      message: err.message || "Some error occured while retrieving Expense Out",
    });
  });
};


exports.Retailer_exp_out = async (req, res) => {
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
  const Expense_out = db1.expense_out;

  Expense_out.findAll({
    include: [
      {
        model:db1.expense_setup,
        as:'exp_out',
        include: [
          {
            model:db1.expense_type,
            as:'exp_type'
          }
        ]
      },
      {
        model:db.users,
        as:'expense_out_user'
      },
      {
        model:db.department_setup,
        as:'dept_exp_out'
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
      message: err.message || "Some error occured while retrieving Expense_out",
    });
  });
};