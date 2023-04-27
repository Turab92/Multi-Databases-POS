const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createTaxCal': {
        return [ 
            body('dept_id', 'dept_id is required').notEmpty(),
            body('dept_id', 'dept_id value must be in integer').isInt(),
            body('start_date', 'start_date is required').notEmpty(),
            body('start_date', 'start_date value must be in date formit').isDate(),
            body('end_date', 'end_date is required').notEmpty(),
            body('end_date', 'end_date value must be in date formit').isDate(),
            body('tax_percentage', 'tax_percentage is required').notEmpty(),
            body('tax_percentage', 'tax_percentage value must be in integer').isFloat(),
            // body('tax_gen_date', 'tax_gen_date is required').notEmpty(),
            // body('tax_gen_date', 'tax_gen_date value must be in date formit').isDate(),
            // body('total_mat_sale', 'total_mat_sale is required').notEmpty(),
            // body('total_mat_sale', 'total_mat_sale value must be in integer').isInt(),
            // body('total_mat_sale_qty', 'total_mat_sale_qty is required').notEmpty(),
            // body('total_mat_sale_qty', 'total_mat_sale_qty value must be in integer').isInt(),
            body('user_id', 'user_id is required').notEmpty(),
            body('user_id', 'user_id value must be in integer').isInt(),
        ]   
    }
    case 'updateTaxCal': {
        return [ 
            body('dept_id', 'dept_id is required').notEmpty(),
            body('dept_id', 'dept_id value must be in integer').isInt(),
            body('start_date', 'start_date is required').notEmpty(),
            body('start_date', 'start_date value must be in date formit').isDate(),
            body('end_date', 'end_date is required').notEmpty(),
            body('end_date', 'end_date value must be in date formit').isDate(),
            body('total_tax_amount', 'total_tax_amount is required').notEmpty(),
            body('total_tax_amount', 'total_tax_amount value must be in integer').isFloat(),
            body('tax_gen_date', 'tax_gen_date is required').notEmpty(),
            body('tax_gen_date', 'tax_gen_date value must be in date formit').isDate(),
            body('total_mat_sale', 'total_mat_sale is required').notEmpty(),
            body('total_mat_sale', 'total_mat_sale value must be in integer').isInt(),
            body('total_mat_sale_qty', 'total_mat_sale_qty is required').notEmpty(),
            body('total_mat_sale_qty', 'total_mat_sale_qty value must be in integer').isInt(),
            body('user_id', 'user_id is required').notEmpty(),
            body('user_id', 'user_id value must be in integer').isInt(),
            body('status', 'Status is required').notEmpty(),
            body('status', 'Status value must be in integer').isInt(),
            ]   
        }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Tax_calculation = db1.tax_calculation;
  const Mart_ord_det = db1.mart_ord_det;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    startdate=req.body.start_date+' 00:00:00.00 +00:00'
    enddate=req.body.end_date+' 23:59:59.00 +00:00'
    Mart_ord_det.findAll({
      where: {
          createdAt: 
          {
            [Op.between]: [startdate,enddate] 
          },
          dept_id:req.body.dept_id,
           status:1 
      }
      })
      .then((data) => {
        if(!data.length)
         {
            res.status(500).send({
              message: "Sale Data Not Found",
            });
         }
         else
         {

            total_tax=0
            total_mat=0
            total_qty=0
            for(var d of data){
              get_profit= d.dataValues.price - d.dataValues.purchase_rate
              set_profit= get_profit * d.dataValues.total_uom
              check_disc= set_profit * d.dataValues.quantity
              total_profit = check_disc - d.dataValues.discount
              tax_cal=(total_profit/100) * req.body.tax_percentage
              total_tax += tax_cal
              total_mat += 1
              total_qty += parseInt(d.dataValues.quantity)
            }

            let today = new Date();//returndate
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var date3 = yyyy + '-' + mm + '-' + dd;
            let date2 = new Date(date3);

            const tax_calculation = {
              dept_id: req.body.dept_id,
              start_date: req.body.start_date,
              end_date: req.body.end_date,
              tax_percentage: req.body.tax_percentage,
              total_tax_amount: total_tax,
              tax_gen_date: date2,
              total_mat_sale: total_mat,
              total_mat_sale_qty: total_qty,
              user_id: req.body.created_by,
              status: 1
            };

              Tax_calculation.create(tax_calculation)
              .then((data) => {
                res.status(200).send(data);
              })
              .catch((err) => {
                res.status(500).send({
                    message: err.message || "Some error occurred while create the Tax Calculation",
                });
              });       
         }
            
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occured while retrieving Order Detail",
        });
      });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Tax_calculation = db1.tax_calculation;

    Tax_calculation.findAll({
      where:{dept_id:req.params.deptid},
      include: [
        {
          model: db.department_setup,
          as: 'dept_tax_cal'
        }
      ]
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Tax Calculation",
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
  const Tax_calculation = db1.tax_calculation;

  Tax_calculation.findAll({
    where:{status:1,dept_id:req.params.deptid},
    include: [
      {
        model: db.department_setup,
        as: 'dept_tax_cal'
      }
    ]
  })//findAll return array
  .then((data) => {
      if(!data.length)
      {
         res.status(500).send({
                 message: "Some error occured while retrieving Tax Calculation",
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
  const Tax_calculation = db1.tax_calculation;

  const id = req.params.id;
  Tax_calculation.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Tax Calculation with id=" + id,
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
  const Tax_calculation = db1.tax_calculation;

    const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    {
      Tax_calculation.update(req.body, {
        where: { tax_cal_id: id },
      }).then((data) => {
        if (data[0] != 0) {
          res.status(200).send({
            message: "Tax Calculation was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update Tax Calculation with id=${id}`,
          });
        }
      });
    }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Tax_calculation = db1.tax_calculation;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Tax_calculation.destroy({
    where: { tax_cal_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Tax Calculation was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Tax Calculation with id=${id}`,
      });
    }
  });
};

exports.Retailer_tax_cal = async (req, res) => {
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
  const Tax_calculation = db1.tax_calculation;

    Tax_calculation.findAll({
      include: [
        {
          model: db.department_setup,
          as: 'dept_tax_cal'
        }
      ]
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Tax Calculation",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};
