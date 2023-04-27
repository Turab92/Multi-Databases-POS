const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createSaleReturn': {
     return [ 
        // body('material_id', 'Material is required').notEmpty(),
        // body('material_id', 'Material value must be in integer').isInt(),
        // body('return_qty', 'Return Quantity is required').notEmpty(),
        // body('return_qty', 'Return Quantity value must be in integer').isInt(),
        // body('m_od_id', 'Order Detail is required').notEmpty(),
        // body('m_od_id', 'Order Detail value must be in integer').isInt(),
        // body('return_date', 'Return Date is required').notEmpty(),
        // body('till_id', 'Till is required').notEmpty(),
        // body('till_id', 'Till value must be in integer').isInt(),
        // body('user_id', 'User is required').notEmpty(),
        // body('user_id', 'User value must be in integer').isInt(),
       ]   
    }
  }
}

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Sales_return_setup = db1.sales_return_setup;
  const Mart_ord_det = db1.mart_ord_det;
  const Mat_rate_setup = db1.mat_rate_setup;
  const Mart_ord_mas = db1.mart_ord_mas;
  const Raw_mat_cat = db1.raw_mat_cat;
  const Ret_expiry_setup = db1.ret_expiry_setup;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
         
      var data = await Ret_expiry_setup.findAll({
          where:{material_id: req.body.material_id, status:1}
        });
        if(!data.length)
        {
          res.status(500).send({
                  message: "Retrun expiry days not define in material return setup",
              });
        }
        else
        {
          var data1 = await Mart_ord_det.findAll({
            where:{m_od_id: req.body.m_od_id, status:1}
          });
          if(!data1.length)
          {
            res.status(500).send({
              message:"Sorry, No order details found",
            });
          }
          else
          {
            var saledate=new Date(data1[0].dataValues.updatedAt)
            var dd1 = String(saledate.getDate()).padStart(2, '0');
            var mm1 = String(saledate.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy1 = saledate.getFullYear();
            var date0 = yyyy1 + '-' + mm1 + '-' + dd1;
            let date1 = new Date(date0);//saledate

            let today = new Date();//returndate
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var date3 = yyyy + '-' + mm + '-' + dd;
            let date2 = new Date(date3);

            const sale_return = {
              material_id: req.body.material_id,
              mat_cat_id: req.body.mat_cat_id,
              return_qty: req.body.return_qty,
              m_od_id: req.body.m_od_id,
              price: req.body.price,
              ret_shift_id: req.body.ret_shift_id,
              return_date: date2,
              dept_id: data1[0].dataValues.dept_id,
              user_id: req.body.user_id,
              status: 1,
            };

            var differ=getDifferenceInDays(date1, date2)
            function getDifferenceInDays(date1, date2) {
              const diffInMs = Math.abs(date2 - date1);
              return diffInMs / (1000 * 60 * 60 * 24);
            }

            if(differ > data[0].dataValues.return_days)
            {
              res.status(500).send({
                message:"Sorry, Return Date exceeded",
              });
            }

            if( req.body.return_qty > data1[0].dataValues.quantity)
            {
              res.status(500).send({
                message:"Return quantity cannot greater than sale quantity",
              });
            }
            else
            {
              var newqty=data1[0].dataValues.quantity -  req.body.return_qty

              var data3 = await Sales_return_setup.create(sale_return)

              var data5 = await Mat_rate_setup.findAll({
                where:{ material_id:req.body.material_id,status:1 }
              })
              if(!data5.length)
              {
                res.status(500).send({
                  message:"Sorry, material rate not found",
                });
              }
              else
              {
                var data4 = await Raw_mat_cat.findAll({
                  where:{ mat_cat_id:req.body.mat_cat_id,status:1 }
                })
                if(!data4.length)
                {
                  res.status(500).send({
                    message:"Sorry, material category not found",
                  });
                }
                else
                {
                  var price = data5[0].mat_current_rate * data4[0].mat_cat_uom
                  var tot= price * newqty;
                  var disc;
                  if(data4[0].mat_cat_disc!=0)
                  {
                    disc=(tot/100)*data4[0].mat_cat_disc;
                  }
                  else
                  {
                    disc=0;
                  }

                    const mart_ord_det = {
                      quantity: newqty,
                      total: tot,
                      discount: disc,
                      total_uom: data4[0].mat_cat_uom * newqty,
                      net_total: tot-disc,
                      is_return: 1,
                      sale_return_id: data3.dataValues.sale_return_id,
                    };
                    var data6 = await Mart_ord_det.update(mart_ord_det, {
                      where: { m_od_id: data3.dataValues.m_od_id },
                    })
                    if(data6[0] != 0)
                    {
                      var data7 = await Mart_ord_mas.findAll({
                        where:{ m_om_id: data1[0].dataValues.m_om_id }
                      })
                      if(!data7.length)
                      {
                        res.status(500).send({
                          message:"Sorry, order master not found",
                        });
                      }
                      else
                      {
                        var deduct_amount=price * req.body.return_qty

                        const mart_ord_mas = {
                          total_amount: data7[0].dataValues.total_amount - deduct_amount,
                          net_amount: data7[0].dataValues.net_amount - deduct_amount,
                          
                        };
                        var data8 = await Mart_ord_mas.update(mart_ord_mas, {
                          where: { m_om_id: data1[0].dataValues.m_om_id },
                        })
                        if(data8[0] != 0)
                        {
                          res.status(200).send({
                            message:"Order return successfully"
                          })
                        }
                        else
                        {
                          res.status(500).send({
                            message:`Cannot update order master with id=${data1[0].dataValues.m_om_id}`,
                          });
                        }
                      }
                    }
                    else
                    {
                      res.status(500).send({
                        message:`Cannot update order details with id=${data3.dataValues.m_od_id}`,
                      });
                    }
                }
              }
            }
          }
        }
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Sales_return_setup = db1.sales_return_setup;

    Sales_return_setup.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Sales Return",
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
  const Sales_return_setup = db1.sales_return_setup;

  const id = req.params.id;
  Sales_return_setup.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Sales Return with id=" + id,
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
  const Sales_return_setup = db1.sales_return_setup;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
  Sales_return_setup.update(req.body, {
    where: { sale_return_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Sales Return was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Sales Return with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Sales_return_setup = db1.sales_return_setup;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Sales_return_setup.destroy({
    where: { sale_return_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Sales Return was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Sales Return with id=${id}`,
      });
    }
  });
};

exports.BSR_Report = async (req, res) => {
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
  const Sales_return_setup = db1.sales_return_setup;

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
  Sales_return_setup.findAll({
    where:check,
    include: [
      {
        model: db.raw_material,
        as: 'return_ord_raw',
      },
      {
        model: db1.raw_mat_cat,
        as: 'return_ord_mat_cat',
      },
      {
        model:db1.mart_ord_det,
        as:'return_ord_detail'
      },
      {
          model:db.department_setup,
          as:'dept_return', 
      },
      {
        model:db.users,
        as:'return_user'
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
      message: err.message || "Some error occured while retrieving Sale Return",
    });
  });
};

exports.Retailer_sale_return = async (req, res) => {
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
  const Sales_return_setup = db1.sales_return_setup;

    Sales_return_setup.findAll({
      where:{status:1},
      include: [
        {
          model: db.raw_material,
          as: 'return_ord_raw',
        },
        {
          model: db1.raw_mat_cat,
          as: 'return_ord_mat_cat',
        },
        {
          model:db1.mart_ord_det,
          as:'return_ord_detail'
        },
        {
            model:db.department_setup,
            as:'dept_return', 
        },
        {
          model:db.users,
          as:'return_user'
        }
  
      ]
    })//findAll return array
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
};