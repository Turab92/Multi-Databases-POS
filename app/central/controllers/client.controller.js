const db = require("../models/user");
const Client = db.client;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createClient': {
     return [ 
        body('client_name', 'Client name is required').notEmpty(),
        body('phone_no', 'Phone number is required').notEmpty(),
        body('phone_no', 'Invalid phone number').isInt(),
        body('phone_no', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }),
        body('currency','Currency is required').notEmpty(),
        body('entity_type','Entity type is required').notEmpty(),
        body('federal_tax_no','Federal tax number is required').notEmpty(),
        body('regional_tax_no','Regional tax numberEntity type is required').notEmpty(),
        body('tax_filer_status','Tax filer status is required').notEmpty(),
        body('tax_region','Tax region is required').notEmpty(),
        body('sales_tax_no','Sales tax number is required').notEmpty(),
        body('sales_tax_exempted','Sales tax exempted is required').notEmpty(),
        body('meeting_address','Meeting address is required').notEmpty(),
        body('country','Country is required').notEmpty(),
        body('province','Province is required').notEmpty(),
        body('city','City is required').notEmpty(),
        body('email_address','Email address is required').notEmpty(),
        body('email_address', 'Invalid email').isEmail(),

       ]   
    }
    case 'updateClient': {
      return [ 
        body('client_name', 'Client name is required').notEmpty(),
        body('phone_no', 'Phone number is required').notEmpty(),
        body('phone_no', 'Invalid phone number').isInt(),
        body('phone_no', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }),
        body('currency','Currency is required').notEmpty(),
        body('entity_type','Entity type is required').notEmpty(),
        body('federal_tax_no','Federal tax number is required').notEmpty(),
        body('regional_tax_no','Regional tax numberEntity type is required').notEmpty(),
        body('tax_filer_status','Tax filer status is required').notEmpty(),
        body('tax_region','Tax region is required').notEmpty(),
        body('sales_tax_no','Sales tax number is required').notEmpty(),
        body('sales_tax_exempted','Sales tax exempted is required').notEmpty(),
        body('meeting_address','Meeting address is required').notEmpty(),
        body('country','Country is required').notEmpty(),
        body('province','Province is required').notEmpty(),
        body('city','City is required').notEmpty(),
        body('email_address','Email address is required').notEmpty(),
        body('email_address', 'Invalid email').isEmail(),
        body('status','status is required').notEmpty(),
        body('status','Value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      const client = {
        client_name: req.body.client_name,
        currency: req.body.currency,
        entity_type: req.body.entity_type,
        federal_tax_no: req.body.federal_tax_no,
        regional_tax_no: req.body.regional_tax_no,
        tax_filer_status: req.body.tax_filer_status,
        tax_region: req.body.tax_region,
        sales_tax_no: req.body.sales_tax_no,
        sales_tax_exempted: req.body.sales_tax_exempted,
        meeting_address: req.body.meeting_address,
        country: req.body.country,
        province: req.body.province,
        city: req.body.city,
        email_address: req.body.email_address,
        phone_no: req.body.phone_no,
        reference: req.body.reference,
        notes: req.body.notes,
        status:'1',
      };

      Client.create(client)
        .then((data) => {
        res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while create the Client",
          });
        });
  }
};

exports.findAll = (req, res) => {
    Client.findAll({
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
};

exports.findAllData = (req, res) => {
  Client.findAll()
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

exports.findOne = (req, res) => {
  const id = req.params.id;
  Client.findByPk(id)
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
};

exports.update = (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Client.update(req.body, {
      where: { client_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Client was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Client with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Client.destroy({
    where: { client_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Client was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Client with id=${id}`,
      });
    }
  });
};


