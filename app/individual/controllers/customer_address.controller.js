const db = require("../../central/models/user");
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createCA': {
     return [ 
        body('dept_id', 'dept id is required').notEmpty(),
        body('dept_id', 'dept id value must be in integer').isInt(),
        body('area_id', 'area id is required').notEmpty(),
        body('area_id', 'area id value must be in integer').isInt(),
        body('cus_id', 'cus id is required').notEmpty(),
        body('cus_id', 'cus id value must be in integer').isInt(),
        body('address', 'Address is required').notEmpty(),
        body('address_label', 'Address label is required').notEmpty(),
       ]   
    }
    case 'updateCA': {
      return [ 
        body('dept_id', 'dept id is required').notEmpty(),
        body('dept_id', 'dept id value must be in integer').isInt(),
        body('area_id', 'area id is required').notEmpty(),
        body('area_id', 'area id value must be in integer').isInt(),
        body('cus_id', 'cus id is required').notEmpty(),
        body('cus_id', 'cus id value must be in integer').isInt(),
        body('address', 'Address is required').notEmpty(),
        body('address_label', 'Address label is required').notEmpty(),
        // body('status', 'status is required').notEmpty(),
        // body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Customer_address = db1.customer_address;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    const customer_address = {
      dept_id: req.body.dept_id,
      area_id: req.body.area_id,
      cus_id: req.body.cus_id,
      address: req.body.address,
      address_label: req.body.address_label,
      status:'1',
    };

    Customer_address.create(customer_address)
      .then((data) => {
      res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while create the Customer Address",
        });
      });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Customer_address = db1.customer_address;

    const cusid = req.params.cusid;
    Customer_address.findAll({
        where:{cus_id:cusid}
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
        message: err.message || "Some error occured while retrieving Customer Address",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Customer_address = db1.customer_address;

  const id = req.params.id;
  Customer_address.findByPk(id)
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
        message: "Error retrieving Customer Address with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Customer_address = db1.customer_address;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Customer_address.update(req.body, {
      where: { address_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Customer Address was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Customer Address with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Customer_address = db1.customer_address;

  const id = req.params.id;
  Customer_address.destroy({
    where: { address_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Customer Address was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Customer Address with id=${id}`,
      });
    }
  });
};


