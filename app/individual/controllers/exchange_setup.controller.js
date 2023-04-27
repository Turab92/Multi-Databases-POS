const db = require("../../central/models/user");
const Retailer = db.retailer;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createExchange': {
     return [ 
        body('material_id', 'Material is required').notEmpty(),
        body('material_id', 'Material value must be in integer').isInt(),
        body('exchange_qty', 'Exchange Quantity is required').notEmpty(),
        body('exchange_qty', 'Exchange Quantity value must be in integer').isFloat(),
        body('m_od_id', 'Order Master is required').notEmpty(),
        body('m_od_id', 'Order Master value must be in integer').isInt(),
        body('exchange_date', 'Exchange Date is required').notEmpty(),
        body('day_id', 'Day id is required').notEmpty(),
        body('day_id', 'Day id value must be in integer').isInt(),
        body('till_id', 'Till is required').notEmpty(),
        body('till_id', 'Till value must be in integer').isInt(),
        body('user_id', 'User is required').notEmpty(),
        body('user_id', 'User value must be in integer').isInt(),
       ]   
    }
  }
}

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Exchange_setup = db1.exchange_setup;
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
                message: "Some error occured while retrieving Return expiry",
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
  
          const exchange_setup = {
            material_id: req.body.material_id,
            mat_cat_id: req.body.mat_cat_id,
            exchange_qty: req.body.exchange_qty,
            price: req.body.price,
            m_od_id: req.body.m_od_id,
            exch_shift_id: req.body.exch_shift_id,
            new_m_om_id: req.body.new_m_om_id,
            dept_id: data1[0].dataValues.dept_id,
            exchange_date: date2,
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
  
          if( req.body.exchange_qty > data1[0].dataValues.quantity)
          {
            res.status(500).send({
              message:"Exchange quantity cannot greater than sale quantity",
            });
          }
          else
          {
            var newqty=data1[0].dataValues.quantity -  req.body.exchange_qty
  
            var data3 = await Exchange_setup.create(exchange_setup)
  
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
                    is_exchange: 1,
                    exchange_id: data3.dataValues.exchange_id,
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
                      var deduct_amount=price * req.body.exchange_qty
          
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
                          message:"Order exchange successfully",
                          data:data3
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
  const Exchange_setup = db1.exchange_setup;

    Exchange_setup.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Exchange Materials",
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
  const Exchange_setup = db1.exchange_setup;

  const id = req.params.id;
  Exchange_setup.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Exchange Materials with id=" + id,
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
  const Exchange_setup = db1.exchange_setup;

  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
  Exchange_setup.update(req.body, {
    where: { exchange_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Exchange Materials was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Exchange Materials with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Exchange_setup = db1.exchange_setup;

  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Exchange_setup.destroy({
    where: { exchange_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Exchange Materials was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Exchange Materials with id=${id}`,
      });
    }
  });
};

exports.BSE_Report = async (req, res) => {
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
  const Exchange_setup = db1.exchange_setup;

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
  Exchange_setup.findAll({
    where:check,
    include: [
      {
        model: db.raw_material,
        as: 'exchange_ord_raw',
      },
      {
        model: db1.raw_mat_cat,
        as: 'exchange_ord_mat_cat',
      },
      {
        model:db1.mart_ord_det,
        as:'exchange_ord_detail'
      },
      {
        model:db.department_setup,
        as:'dept_exchange', 
      },
      {
        model:db.users,
        as:'exchange_user'
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
      message: err.message || "Some error occured while retrieving Sale Exchange",
    });
  });
};

exports.Retailer_sale_exchange = async (req, res) => {
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
  const Exchange_setup = db1.exchange_setup;

    Exchange_setup.findAll({
      where:{status:1},
      include: [
        {
          model: db.raw_material,
          as: 'exchange_ord_raw',
        },
        {
          model: db1.raw_mat_cat,
          as: 'exchange_ord_mat_cat',
        },
        {
          model:db1.mart_ord_det,
          as:'exchange_ord_detail'
        },
        {
          model:db.department_setup,
          as:'dept_exchange', 
        },
        {
          model:db.users,
          as:'exchange_user'
        }
  
      ]
    })//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Exchange Materials",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};