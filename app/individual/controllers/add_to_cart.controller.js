const db = require("../../central/models/user");
const { body,validationResult  } = require('express-validator');
const { Session } = require("electron");

exports.validate = (method) => {
  switch (method) {
    case 'createCart': {
     return [ 
        body('session_id', 'Session id is required').notEmpty(),
        body('item_id', 'item id is required').notEmpty(),
        body('item_id', 'item id value must be in integer').isInt(),
        body('item_type', 'Session id is required').notEmpty(),
        body('quantity', 'Quantity is required').notEmpty(),
        body('quantity', 'Quantity value must be in integer').isFloat(),
       ]   
    }
    case 'updateCart': {
      return [ 
        body('session_id', 'Session id is required').notEmpty(),
        body('item_id', 'item id is required').notEmpty(),
        body('item_id', 'item id value must be in integer').isInt(),
        body('item_type', 'Session id is required').notEmpty(),
        body('quantity', 'Quantity is required').notEmpty(),
        body('quantity', 'Quantity value must be in integer').isFloat(),
        body('status', 'status is required').notEmpty(),
        body('status', 'status value must be in integer').isInt(),
        ]   
     }
    case 'updateQuantity': {
      return [ 
        body('quantity', 'Quantity is required').notEmpty(),
        body('quantity', 'Quantity value must be in integer').isFloat(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const add_to_cart = {
      session_id: req.body.session_id,
      item_id: req.body.item_id,
      item_type: req.body.item_type,
      quantity: req.body.quantity,
      status:'0',
    };
    Add_to_cart.findAll({
      where:{session_id: req.body.session_id, item_id:req.body.item_id,item_type: req.body.item_type}
      })
      .then((data) => {
        if(!data.length)
        {
          Add_to_cart.create(add_to_cart)
          .then((data) => {
          res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Cart",
            });
          });
        }
        else
        {
          const add_to_cart = {
            quantity: data[0].dataValues.quantity+1,
          };
          Add_to_cart.update(add_to_cart, {
            where: { session_id: req.body.session_id, item_id:req.body.item_id},
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Cart was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Cart with id=${id}`,
              });
            }
          });
        }
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving Cart",
        });
      });
    
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

    const session = req.params.session;
    Add_to_cart.findAll({
        where:{session_id:session}
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
        message: err.message || "Some error occured while retrieving Cart",
      });
    });
};

exports.findItem = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const session = req.body.session;
  const itemid = req.body.item_id;
  const type = req.body.type;
  Add_to_cart.findAll({
      where:{item_id:itemid,item_type:type,session_id:session}
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
      message: err.message || "Some error occured while retrieving Cart",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const id = req.params.id;
  Add_to_cart.findByPk(id)
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
        message: "Error retrieving Cart with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Add_to_cart.update(req.body, {
      where: { cart_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Cart was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Cart with id=${id}`,
        });
      }
    });
  }
};

exports.update_qty = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Add_to_cart.update({quantity:req.body.quantity}, {
      where: { cart_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Cart was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Cart with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const id = req.params.id;
  Add_to_cart.destroy({
    where: { cart_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Cart was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Cart with id=${id}`,
      });
    }
  });
};

exports.deleteAll = (req, res) => {
  const db1=req.ret_db
  const Add_to_cart = db1.add_to_cart;

  const id = req.params.id;
  Add_to_cart.destroy({
    where: { session_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Cart was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Cart with id=${id}`,
      });
    }
  });
};


