const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createDP': {
     return [ 
        body('dp_name', 'Provider name is required').notEmpty(),
        body('web_app_status', 'web_app_status is required').notEmpty(),
        body('web_app_status', 'web_app_status value must be in integer').isInt(),
       ]   
    }
    case 'updateDP': {
      return [ 
          body('dp_name', 'Provider name is required').notEmpty(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Deal_provider = db1.deal_provider;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const deal_provider = {
      dp_name: req.body.dp_name,
      dp_disc: req.body.dp_disc,
      web_app_status: req.body.web_app_status,
      status:'1',
    };
    Deal_provider.findAll({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('dp_name')), 
        sequelize.fn('lower', req.body.dp_name)
      )
    })
      .then((data) => {
        if(!data.length)
          {
            Deal_provider.create(deal_provider)
            .then((data) => {
            res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Deal provider",
              });
            });
             
          }
          else
          {
            res.status(400).send({
              message: "Data Already Exist",
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
  const Deal_provider = db1.deal_provider;

    Deal_provider.findAll({
      where:{status:1},
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
        message: err.message || "Some error occured while retrieving Deal provider",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Deal_provider = db1.deal_provider;

  Deal_provider.findAll()
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
      message: err.message || "Some error occured while retrieving Deal provider",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Deal_provider = db1.deal_provider;

  const id = req.params.id;
  Deal_provider.findByPk(id)
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
        message: "Error retrieving Deal provider with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Deal_provider = db1.deal_provider;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Deal_provider.update(req.body, {
      where: { dp_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Deal provider was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Deal provider with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Deal_provider = db1.deal_provider;

  const id = req.params.id;
  Deal_provider.destroy({
    where: { dp_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Deal provider was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Deal provider with id=${id}`,
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
  const Deal_provider = db1.deal_provider;

  Deal_provider.findAll()
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
      message: err.message || "Some error occured while retrieving Deal provider",
    });
  });
};


