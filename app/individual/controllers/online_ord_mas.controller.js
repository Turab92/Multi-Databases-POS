const db = require("../../central/models/user");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Retailer = db.retailer;
var cron = require('node-cron');
var moment = require('moment');
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const dbConfig = require("../../confiq/db.config");

cron.schedule('0 * * * *', () => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;
  const Online_ord_det = db1.online_ord_det;

  console.log('running a task every minute');
  var yesterday=moment().subtract(7, 'hours').format();
    console.log(yesterday)
   
    Online_ord_mas.findAll({
      where:
      {
        [Op.or]: [{
          status:0,
          createdAt:
          {
            [Op.lte] : yesterday
          }
        },
        {
          status:1,
          delivered_status:null,
          createdAt:
          {
            [Op.lte] : yesterday
          }
        }
        ]
      },
        attributes:['on_om_id']
    }).then((data) => {
      if(!data.length)
        {
          //  res.status(500).send({
          //          message: "Data Not Found",
          //     });
        }
        else
        {
          Online_ord_mas.update({status:2}, {
            where:{
              [Op.or]: [{
                status:0,
                createdAt:
                {
                  [Op.lte] : yesterday
                }
              },
              {
                status:1,
                delivered_status:null,
                createdAt:
                {
                  [Op.lte] : yesterday
                }
              }
              ]
            }
        });
          for (var det of data) {
            console.log(det.dataValues.on_om_id)
            Online_ord_det.update({status:2}, {
              where: { on_om_id: det.dataValues.on_om_id },
            });
          } 
        }
      })
});

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;
  const Order_type_detail = db1.ord_type_detail;
  const Order_types = db1.order_type;
  const Online_ord_det = db1.online_ord_det;
  const Customers = db1.customers;
  const deal_setup = db1.deal_setup;
  const Areas = db1.areas;
  const Tax_setup = db1.tax_type;
  const Subpro_rate_setup = db1.subpro_rate_setup;

  if (!req.body.ord_date) {
    res.status(202).send({
      message: "Order Date can not be empty !",
    });
    return;
  }
 
  var otd
  var online_ord_det
  var area = await Areas.findByPk(req.body.area_id);
  var tax = await Tax_setup.findByPk(req.body.tax_id);

  var cus = await Customers.findByPk(req.body.cus_id);
    if (!req.body.cart_item.length) {
      res.status(202).send({
        message: "Sorry null item not accepted.",
      });
    }

    if(!cus)
      {
         res.status(202).send({
                 message: "Sorry! Data Not Found With Id=" + req.body.cus_id,
            });
      }
      else
      {
        var ord_type = await Order_types.findAll({
          where: { o_type_name: 'Online', status: 1 },
        });
        if (!ord_type.length) {
          res.status(202).send({
            message: "This order type is not found",
          });
        }
        const ord_type_detail = {
          ord_type_id: ord_type[0].dataValues.o_type_id,
          cus_id: req.body.cus_id,
          cus_name: cus.cus_name,
          cus_phone:cus.cus_phone,
          cus_address: req.body.cus_address,
          order_type: req.body.order_type,
          online_type: req.body.online_type,
          status:'1',
        };    
        otd = await Order_type_detail.create(ord_type_detail);
      }
      const online_ord_mas = {
        dept_id: req.body.dept_id,
        area_id: req.body.area_id,
        ord_date: req.body.ord_date,
        cus_id: req.body.cus_id,
        ot_de_id: otd.ot_d_id,
        tax_id: tax.tax_id,
        delivery_charges: area.delivery_charges,
        comment: req.body.comment,
        status:'0',
      };
      on_om = await Online_ord_mas.create(online_ord_mas);
      var totalAmount =0;
      var itemTotal =0;
      var dealTotal =0;
      var taxAmount = 0;
      var netAmount =0;

      for(var item of req.body.cart_item){
        if(item.ds_id == null)
        {
            var sub_rate = await Subpro_rate_setup.findAll({
              where: { sub_pro_id: item.sub_pro_id, status: 1 },
            });
            if (!sub_rate.length) {
              res.status(202).send({
                message: "Sub product rate not found",
              });
            }
            var tot = sub_rate[0].dataValues.net_rate * item.quantity;
            var disc;
            if (sub_rate[0].dataValues.discount != 0) {
              disc = (tot / 100) * sub_rate[0].dataValues.discount;
            } else {
              disc = 0;
            }
           online_ord_det = {
            on_om_id: on_om.on_om_id,
            dept_id: req.body.dept_id,
            main_pro_id: null,
            sub_pro_id: item.sub_pro_id,
            price: sub_rate[0].dataValues.net_rate,
            quantity: item.quantity,
            discount: disc,
            total: tot,
            net_total: tot - disc,
            status: "0",
          };
          itemTotal =itemTotal +online_ord_det.net_total;
        }
        else if(item.sub_pro_id == null)
        {
          var deal = await deal_setup.findByPk(item.ds_id);
           online_ord_det = {
            on_om_id: on_om.on_om_id,
            dept_id: req.body.dept_id,
            main_pro_id: null,
            ds_id: item.ds_id,
            db_id: item.db_id,
            price: deal.price,
            discount:0,
            quantity: item.quantity,
            total: deal.price * item.quantity,
            net_total:deal.price * item.quantity,
            status: "0",
          };
          dealTotal =dealTotal +online_ord_det.net_total;

        }
        var on_od = await Online_ord_det.create(online_ord_det);
        totalAmount = dealTotal +itemTotal;
        taxAmount = (tax.tax_percentage /100 ) * totalAmount;
        netAmount = totalAmount +taxAmount;
      }
      const online_ord_update = {
        total_amount: totalAmount,
        item_total: itemTotal,
        net_item: itemTotal,
        deal_total: dealTotal,
        tax_amount: taxAmount,
        net_amount: netAmount,

      };
   
      on_om_upt = await Online_ord_mas.update(online_ord_update, {
        where: { on_om_id: on_om.on_om_id }});
      
      return res.status(200).send(on_om_upt);
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;

  const deptid = req.params.deptid;
  var yesterday=moment().subtract(1, 'days').format();
    Online_ord_mas.findAll({
      where:sequelize.and( {dept_id:deptid},sequelize.where(sequelize.fn('date', sequelize.col('online_ord_mas.createdAt')), '>=', yesterday)),
      include: [
        {
          model: db1.ord_type_detail,
          as: 'online_otd'
        },
        {
          model: db.department_setup,
          as: 'online_dept'
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

exports.findConfirm = (req, res) => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;

  const deptid = req.params.dept_id;
  const userid =  req.params.user_id;
  Online_ord_mas.findAll({
    where:{
      [Op.or]:
[
      {on_om_id:{
        [sequelize.Op.notIn]:sequelize.literal(`(SELECT o.on_om_id FROM order_masters o join online_ord_mas r on o.on_om_id=r.on_om_id where o.status!=2)`)
      },},
     {on_om_id:{ [sequelize.Op.in]:sequelize.literal(`(Select o.on_om_id FROM order_masters o where user_id = ${userid} and o.status=0)`)
     }}],
      dept_id:deptid,
      status:1,
    }
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
  const Online_ord_mas = db1.online_ord_mas;

  const id = req.params.id;
  Online_ord_mas.findByPk(id,{
    include: [
      {
        model: db1.online_ord_det,
        as: 'online_ord_det',
        include: [
          {
            model: db1.sub_products,
             as: 'online_sub',
             attributes:['sub_pro_id','sub_pro_name','sub_pro_image'],
          },
          {
            model: db1.deal_setup,
             as: 'online_deal',
             attributes:['ds_id','ds_name','ds_img'],
          }
        ]
      },
      {
        model: db1.ord_type_detail,
        as: 'online_otd',
        attributes:['ot_d_id','ord_type_id','cus_address','order_type','online_type'],
        include: [
          {
            model: db1.order_type,
             as: 'online_ord_type',
             attributes:['o_type_id','o_type_name'],
          }
        ]
      },
      {
        model: db1.customers,
        as: 'online_customer'
      },
      {
        model: db.department_setup,
        as: 'online_dept',
        attributes:['dept_id','dept_name']
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

exports.findCusDetail = (req, res) => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;

  const cusid = req.params.cus_id;
  Online_ord_mas.findAll({
    where:{cus_id:cusid},
    include: [
      {
        model: db1.online_ord_det,
        as: 'online_ord_det',
        include: [
          {
            model: db1.sub_products,
             as: 'online_sub',
             attributes:['sub_pro_id','sub_pro_name','sub_pro_image'],
          },
          {
            model: db1.deal_setup,
             as: 'online_deal',
             attributes:['ds_id','ds_name','ds_img'],
          }
        ]
      },
      {
        model: db1.ord_type_detail,
        as: 'online_otd',
        attributes:['ot_d_id','ord_type_id','cus_address','order_type'],
        include: [
          {
            model: db1.order_type,
             as: 'online_ord_type',
             attributes:['o_type_id','o_type_name'],
          }
        ]
      },
      {
        model: db1.customers,
        as: 'online_customer'
      },
      {
        model: db.department_setup,
        as: 'online_dept',
        attributes:['dept_id','dept_name']
      }

    ],
    order: [
        ['on_om_id', 'DESC'],[db1.online_ord_det, 'on_od_id', 'ASC']
      ]
  })
    .then((data) => {
      if(!data)
        {
           res.status(500).send({
                   message: "Sorry! Data Not Found With Id=" + cusid,
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Order Master with id=" + cusid,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;

  const id = req.params.id;

      Online_ord_mas.update(req.body, {
        where: { on_om_id: id },
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

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Online_ord_mas = db1.online_ord_mas;

  const id = req.params.id;

  Online_ord_mas.destroy({
    where: { on_om_id: id },
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

exports.online_orders_graph_web = async (req, res) => {
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
    query=`Select Count(*),to_char(date("om"."createdAt"),'YYYY-MM') as year_month from online_ord_mas om,order_type_details otd where om.status=1 
    and om.delivered_status=1 and om.ot_de_id=otd.ot_d_id and otd.online_type='Web'
    GROUP BY year_month
    ORDER By year_month`;
  }
  else
  {
    query=`Select Count(*),to_char(date("om"."createdAt"),'YYYY-MM') as year_month from online_ord_mas om,order_type_details otd where om.status=1 
    and om.delivered_status=1 and om.dept_id=${deptid} and om.ot_de_id=otd.ot_d_id and otd.online_type='Web'
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

exports.online_orders_graph_app = async (req, res) => {
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
    query=`Select Count(*),to_char(date("om"."createdAt"),'YYYY-MM') as year_month from online_ord_mas om,order_type_details otd where om.status=1 
    and om.delivered_status=1 and om.ot_de_id=otd.ot_d_id and otd.online_type='App'
    GROUP BY year_month
    ORDER By year_month`;
  }
  else
  {
    query=`Select Count(*),to_char(date("om"."createdAt"),'YYYY-MM') as year_month from online_ord_mas om,order_type_details otd where om.status=1 
    and om.delivered_status=1 and om.dept_id=${deptid} and om.ot_de_id=otd.ot_d_id and otd.online_type='App'
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

exports.Retailer_online_live_order = async (req, res) => {
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
  const Online_ord_mas = db1.online_ord_mas;

  const deptid = req.body.deptid;
  var yesterday=moment().subtract(1, 'days').format();
    Online_ord_mas.findAll({
      where:sequelize.and( {dept_id:deptid},sequelize.where(sequelize.fn('date', sequelize.col('online_ord_mas.createdAt')), '>=', yesterday)),
      include: [
        {
          model: db1.online_ord_det,
          as: 'online_ord_det',
          include: [
            {
              model: db1.sub_products,
               as: 'online_sub',
               attributes:['sub_pro_id','sub_pro_name','sub_pro_image'],
            },
            {
              model: db1.deal_setup,
               as: 'online_deal',
               attributes:['ds_id','ds_name','ds_img'],
            }
          ]
        },
        {
          model: db1.ord_type_detail,
          as: 'online_otd',
          attributes:['ot_d_id','ord_type_id','cus_address','order_type','online_type'],
          include: [
            {
              model: db1.order_type,
               as: 'online_ord_type',
               attributes:['o_type_id','o_type_name'],
            }
          ]
        },
        {
          model: db1.customers,
          as: 'online_customer'
        },
        {
          model: db.department_setup,
          as: 'online_dept',
          attributes:['dept_id','dept_name']
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