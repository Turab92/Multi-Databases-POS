const db = require("../../central/models/user");
const { body,validationResult  } = require('express-validator');
const Retailer = db.retailer;

exports.validate = (method) => {
  switch (method) {
    case 'createDB': {
     return [ 
        body('ds_id', 'ds_id is required').notEmpty(),
        body('ds_id', 'ds_id value must be in integer').isInt(),
        body('sub_pro_id', 'sub_pro_id is required').notEmpty(),
        body('sub_pro_id', 'sub_pro_id value must be in integer').isInt(),
        body('sub_qty', 'sub_qty is required').notEmpty(),
        body('sub_qty', 'sub_qty value must be in integer').isFloat(),
       ]   
    }
    case 'updateDB': {
      return [ 
        body('ds_id', 'ds_id is required').notEmpty(),
        body('ds_id', 'ds_id value must be in integer').isInt(),
        body('sub_pro_id', 'sub_pro_id is required').notEmpty(),
        body('sub_pro_id', 'sub_pro_id value must be in integer').isInt(),
        body('sub_qty', 'sub_qty is required').notEmpty(),
        body('sub_qty', 'sub_qty value must be in integer').isFloat(),
        body('status', 'status is required').notEmpty(),
        body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const deal_beverages = {
        ds_id: req.body.ds_id,
        sub_pro_id: req.body.sub_pro_id,
        sub_qty: req.body.sub_qty,
        status:'1',
    };
    Deal_beverages.findAll({
      where: {ds_id: req.body.ds_id,sub_pro_id: req.body.sub_pro_id}
    })
      .then((data) => {
        if(!data.length)
          {
            Deal_beverages.create(deal_beverages)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Area",
              });
            });
             
          }
          else
          {
            res.status(400).send({
              message: "This Sub product Already Exist in Deal Beverages",
             });
          }
       
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving Product",
        });
      });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

    Deal_beverages.findAll({
      where:{status:1},
        include: [
          {
            model: db1.deal_setup,
            as: 'deal_bev'
          },
          {
            model: db1.sub_products,
            as: 'deal_bev_sub'
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
        message: err.message || "Some error occured while retrieving Area",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

  Deal_beverages.findAll({
      include: [
          {
            model: db1.deal_setup,
            as: 'deal_bev'
          },
          {
            model: db1.sub_products,
            as: 'deal_bev_sub'
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
      message: err.message || "Some error occured while retrieving Area",
    });
  });
};

exports.findDealBev = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

  const dsid = req.params.ds_id;
  Deal_beverages.findAll({
    where:{ds_id:dsid,status:1},
      include: [
          {
            model: db1.deal_setup,
            as: 'deal_bev',
            attributes:['ds_id','ds_name']
          },
          {
            model: db1.sub_products,
            as: 'deal_bev_sub',
            attributes:['sub_pro_id','sub_pro_name']
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
      message: err.message || "Some error occured while retrieving Area",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

  const id = req.params.id;
  Deal_beverages.findByPk(id,{
    include: [
      {
        model: db1.deal_setup,
        as: 'deal_bev'
      },
      {
        model: db1.sub_products,
        as: 'deal_bev_sub'
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
        message: "Error retrieving Area with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Deal_beverages.update(req.body, {
      where: { db_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Area was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Area with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Deal_beverages = db1.deal_beverages;

  const id = req.params.id;
  Deal_beverages.destroy({
    where: { db_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Area was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Area with id=${id}`,
      });
    }
  });
};

exports.findAllRetailerData = async (req, res) => {
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
  const Deal_beverages = db1.deal_beverages;

  Deal_beverages.findAll({
      include: [
          {
            model: db1.deal_setup,
            as: 'deal_bev'
          },
          {
            model: db1.sub_products,
            as: 'deal_bev_sub'
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
      message: err.message || "Some error occured while retrieving Area",
    });
  });
};
