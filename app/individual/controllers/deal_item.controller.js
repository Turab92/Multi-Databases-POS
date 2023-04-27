const db = require("../../central/models/user");
const Retailer = db.retailer;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDI': {
     return [ 
        body('ds_id', 'deal setup is required').notEmpty(),
        body('ds_id', 'deal setup value must be in integer').isInt(),
        body('dp_id', 'deal provider is required').notEmpty(),
        body('dp_id', 'deal provider value must be in integer').isInt(),
        body('deal_items', 'Sub product Receipe is required').isArray({ min: 1}),
        // body('sub_pro_id', 'Sub Product is required').notEmpty(),
        // body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
        // body('sub_price', 'Price is required').notEmpty(),
        // body('sub_price', 'Price value must be in integer').isFloat(),
        // body('sub_qty', 'Quantity is required').notEmpty(),
        // body('sub_qty', 'Quantity value must be in integer').isFloat(),
        // body('total', 'Total is required').notEmpty(),
        // body('total', 'Total value must be in integer').isFloat(),
       ]   
    }
    case 'updateDI': {
      return [ 
          body('ds_id', 'deal setup is required').notEmpty(),
          body('ds_id', 'deal setup value must be in integer').isInt(),
          body('sub_pro_id', 'Sub Product is required').notEmpty(),
          body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
          body('sub_price', 'Price is required').notEmpty(),
          body('sub_price', 'Price value must be in integer').isFloat(),
          body('sub_qty', 'Quantity is required').notEmpty(),
          body('sub_qty', 'Quantity value must be in integer').isFloat(),
          body('total', 'Total is required').notEmpty(),
          body('total', 'Total value must be in integer').isFloat(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Deal_item = db1.deal_item;
  const Sub_products = db1.sub_products;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    try {
      var arr = [];
      var details= JSON.parse(JSON.stringify(req.body.deal_items))
      for(sub_det of details)
      {
          const deal_item = {
            ds_id: req.body.ds_id,
            dp_id: req.body.dp_id,
            sub_pro_id: sub_det.sub_pro_id,
            sub_price: sub_det.sub_price,
            sub_qty: sub_det.sub_qty,
            total: sub_det.total,
            status:'1',
          };
        var data1= await  Deal_item.findAll({
          where: {ds_id: req.body.ds_id,sub_pro_id: sub_det.sub_pro_id},
            include: [
              {
                model: db1.deal_setup,
                as: 'ds',
              },
              {
                model: db1.sub_products,
                as: 'sub',
              },
            ]
          })
            if(!data1.length)
            {
            var data= await Deal_item.create(deal_item)
            var data2 = await Sub_products.findAll({
              where: {
                sub_pro_id:sub_det.sub_pro_id
              }
            })
                var obj = {
                  sub_pro_id: sub_det.sub_pro_id,
                  status:"Success",
                  message:`${data2[0].dataValues.sub_pro_name} insert successfully`,
                };
                arr.push(obj);
                
            }
            else
            {
                var obj = {
                  material: sub_det.sub_pro_id,
                  status:"Error",
                  message:`Sorry ${data1[0].dataValues.sub.sub_pro_name} already exist on behalf of this ${data1[0].dataValues.ds.ds_name}`,
                };
                arr.push(obj);
            }
          }
            res.status(200).send(arr);
        }
        catch (error)
        {
          res.status(500).send(error);
        }  

  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Deal_item = db1.deal_item;

    Deal_item.findAll({
      where:{status:1},
      include: [
          {
            model: db1.deal_provider,
            as: 'dp_item'
          },
          {
            model: db1.deal_setup,
            as: 'ds'
          },
          {
            model: db1.sub_products,
            as: 'sub'
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
        message: err.message || "Some error occured while retrieving Deal item",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Deal_item = db1.deal_item;

  Deal_item.findAll({
    include: [
        {
          model: db1.deal_provider,
          as: 'dp_item'
        },
        {
          model: db1.deal_setup,
          as: 'ds'
        },
        {
          model: db1.sub_products,
          as: 'sub'
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
      message: err.message || "Some error occured while retrieving Deal item",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Deal_item = db1.deal_item;

  const id = req.params.id;
  Deal_item.findByPk(id,{
    include: [
        {
          model: db1.deal_provider,
          as: 'dp_item'
        },
        {
          model: db1.deal_setup,
          as: 'ds'
        },
        {
          model: db1.sub_products,
          as: 'sub'
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
        message: "Error retrieving Deal item with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Deal_item = db1.deal_item;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Deal_item.update(req.body, {
      where: { di_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Deal item was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Deal item with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Deal_item = db1.deal_item;

  const id = req.params.id;
  Deal_item.destroy({
    where: { di_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Deal item was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Deal item with id=${id}`,
      });
    }
  });
};

exports.findAllDB = async (req, res) => {
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
  const Deal_item = db1.deal_item;

  Deal_item.findAll({
    where:{ds_id:req.body.ds_id},
    include: [
        {
          model: db1.deal_provider,
          as: 'dp_item'
        },
        {
          model: db1.deal_setup,
          as: 'ds'
        },
        {
          model: db1.sub_products,
          as: 'sub'
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
      message: err.message || "Some error occured while retrieving Deal item",
    });
  });
};
