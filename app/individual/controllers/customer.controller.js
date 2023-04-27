const db = require("../../central/models/user");
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createCustomer': {
     return [ 
        body('cus_name', 'Username is required').notEmpty(),
        // body('cus_email', 'Invalid email').isEmail(),
        body('cus_phone', 'Phone  Number is required').notEmpty(),
        body('cus_phone', 'Invalid phone number').isInt(),
        body('cus_phone', 'Minimum 10 and Maximum 12 number required in phone number').isLength({ min: 10 ,max: 12 }),
       ]   
    }
    case 'createWebCustomer': {
      return [ 
         body('cus_name', 'Username is required').notEmpty(),
        //  body('cus_phone', 'Phone  Number is required').notEmpty(),
        //  body('cus_phone', 'Invalid phone number').isInt(),
        //  body('cus_phone', 'Minimum 10 and Maximum 12 number required in phone number').isLength({ min: 10 ,max: 12 }),
        ]   
     }
    case 'checkCustomer': {
      return [ 
         body('cus_phone', 'Phone  Number is required').notEmpty(),
         body('cus_phone', 'Invalid phone number').isInt(),
         body('cus_phone', 'Minimum 10 and Maximum 12 number required in phone number').isLength({ min: 10 ,max: 12 }),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;
  const Order_master = db1.order_master;

  let omid = req.body.om_id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      const customer = {
        cus_name: req.body.cus_name,
        cus_phone: req.body.cus_phone,
        cus_email: req.body.cus_email,
        cus_address: req.body.cus_address,
        status:'1',
      };

      Order_master.findAll({
        where: { om_id: omid },
        })
          .then((data) => {
          if((data[0].cus_id ==null) || (data[0].cus_id ==''))
          {
            Customers.findAll({
              where:{ cus_phone: req.body.cus_phone}
            })
            .then((cus) => {
              if(!cus.length)
              {
                  Customers.create(customer)
                    .then((data) => {
                      const ord_mas_cus = {
                        cus_id: data.cus_id,
                      };
                      Order_master.update(ord_mas_cus, {
                        where: { om_id: omid },
                      }).then((data) => {
                        if (data[0] != 0) {
                          res.status(200).send({
                            message: "Customer updated successfully in order master",
                          });
                        } else {
                          res.status(500).send({
                            message: `Cannot update customer in Order Master with id=${omid}`,
                          });
                        }
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message: err.message || "Some error occurred while create the Customer",
                      });
                    });
              }
              else
              {
                res.status(422).send({
                  message: "Phone number already exist",
                  });
              }
              
            })
            .catch((err) => {
              res.status(502).send({
                message: err.message || "Some error occured while retrieving Customer",
              });
            });
          } 
          else
          {
            Customers.findAll({
              where:{ cus_phone: req.body.cus_phone}
            })
            .then((cus) => {
              if(!cus.length)
              {
                  const customer = {
                    cus_name: req.body.cus_name,
                    cus_phone: req.body.cus_phone,
                    cus_email: req.body.cus_email,
                    cus_address: req.body.cus_address,
                    status:'1',
                  };
                  Customers.update(customer, {
                    where: { cus_id: data[0].cus_id },
                  }).then((data) => {
                    if (data[0] != 0) {
                      res.status(200).send({
                        message: "Customer was updated successfully",
                      });
                    } else {
                      res.status(500).send({
                        message: `Cannot update Customer with id=${data[0].cus_id}`,
                      });
                    }
                  });
              }
              else
              {
                const customer = {
                  cus_name: req.body.cus_name,
                  cus_email: req.body.cus_email,
                  cus_address: req.body.cus_address,
                  status:'1',
                };
                Customers.update(customer, {
                  where: { cus_id: data[0].cus_id },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Phone number already exist Customer was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Customer with id=${data[0].cus_id}`,
                    });
                  }
                });
              }
            })
          
          }
          })
          .catch((err) => {
              return  res.status(500).send({
              message: err.message || "Some error occurred while retreving the Order Master",
            }); 
      
          }); 
    }
};

exports.create1 = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;
  const Mart_ord_mas = db1.mart_ord_mas;

  let omid = req.body.m_om_id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

      const customer = {
        cus_name: req.body.cus_name,
        cus_phone: req.body.cus_phone,
        cus_email: req.body.cus_email,
        cus_address: req.body.cus_address,
        status:'1',
      };

      Mart_ord_mas.findAll({
        where: { m_om_id: omid },
        })
          .then((data) => {
          if((data[0].cus_id ==null) || (data[0].cus_id ==''))
          {
            Customers.findAll({
              where:{ cus_phone: req.body.cus_phone}
            })
            .then((cus) => {
              if(!cus.length)
              {
                  Customers.create(customer)
                  .then((data) => {
                    const ord_mas_cus = {
                      cus_id: data.cus_id,
                    };
                    Mart_ord_mas.update(ord_mas_cus, {
                      where: { m_om_id: omid },
                    }).then((data) => {
                      if (data[0] != 0) {
                        res.status(200).send({
                          message: "Customer updated successfully in order master",
                        });
                      } else {
                        res.status(500).send({
                          message: `Cannot update customer in Order Master with id=${omid}`,
                        });
                      }
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message || "Some error occurred while create the Customer",
                    });
                  });
              }
              else
              {
                res.status(422).send({
                  message: "Phone number already exist",
                 });
              }
              
            })
            .catch((err) => {
              res.status(502).send({
                message: err.message || "Some error occured while retrieving Customer",
              });
            });
            
          } 
          else
          {
            Customers.findAll({
              where:{ cus_phone: req.body.cus_phone}
            })
            .then((cus) => {
              if(!cus.length)
              {
                const customer = {
                  cus_name: req.body.cus_name,
                  cus_phone: req.body.cus_phone,
                  cus_email: req.body.cus_email,
                  cus_address: req.body.cus_address,
                  status:'1',
                };
                Customers.update(customer, {
                    where: { cus_id: data[0].cus_id },
                  }).then((data) => {
                    if (data[0] != 0) {
                      res.status(200).send({
                        message: "Customer was updated successfully",
                      });
                    } else {
                      res.status(500).send({
                        message: `Cannot update Customer with id=${data[0].cus_id}`,
                      });
                    }
                });
              }
              else
              {
                const customer = {
                  cus_name: req.body.cus_name,
                  cus_email: req.body.cus_email,
                  cus_address: req.body.cus_address,
                  status:'1',
                };
                Customers.update(customer, {
                    where: { cus_id: data[0].cus_id },
                  }).then((data) => {
                    if (data[0] != 0) {
                      res.status(200).send({
                        message: "Phone number already exist Customer was updated successfully",
                      });
                    } else {
                      res.status(500).send({
                        message: `Cannot update Customer with id=${data[0].cus_id}`,
                      });
                    }
                });
              }
            })
          }
            
          })
          .catch((err) => {
              return  res.status(500).send({
              message: err.message || "Some error occurred while retreving the Order Master",
            }); 
      
          }); 
    }
};


exports.create_online_cus = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;

  let omid = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      const customer = {
        cus_name: req.body.cus_name,
        cus_phone: req.body.cus_phone,
        status:'1',
      };
      Customers.findAll({
        where:{ cus_phone: req.body.cus_phone}
      })
      .then((cus) => {
        if(!cus.length)
        {
          Customers.create(customer)
            .then((data) => {
              res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message || "Some error occurred while create the Customer",
              });
            });    
        }
        else
        {
          res.status(422).send({
            message: "Phone number already exist",
          });
        }
          
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving Customer",
        });
      });      
    }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;

  Customers.findAll()
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
        message: err.message || "Some error occured while retrieving Customer",
      });
    });
};

exports.findMas = (req, res) => {
  const db1=req.ret_db
  const Order_master = db1.order_master;

  let omid = req.params.id;
  Order_master.findAll({
    where: {  om_id: omid },
      include: [
        {
          model: db.customers,
          as: 'customers'
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
        message: err.message || "Some error occured while retrieving Customer",
      });
    });
};

exports.findMC = (req, res) => {
  const db1=req.ret_db
  const Mart_ord_mas = db1.mart_ord_mas;

  let omid = req.params.id;
  Mart_ord_mas.findAll({
    where: {  m_om_id: omid },
      include: [
        {
          model: db.customers,
          as: 'mart_customers'
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
        message: err.message || "Some error occured while retrieving Customer",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;

  const id = req.params.id;
  Customers.findByPk(id)
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
        message: "Error retrieving Customer with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {

    Customers.update(req.body, {
      where: { cus_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Customer was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Customer with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;

  const id = req.params.id;
  Customers.destroy({
    where: { cus_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Customer was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Customer with id=${id}`,
      });
    }
  });
};

exports.check_customer = (req, res) => {
  const db1=req.ret_db
  const Customers = db1.customers;

  let cusphone = req.body.cus_phone;
 // const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  // if (!errors.isEmpty()) {
  //   res.status(422).json({ errors: errors.array() });
  //   return;
  // }
  // else
  // {
      Customers.findAll({
        where: { cus_phone: cusphone },
        })
          .then((data) => {
            if(!data.length)
            {
              res.status(203).send({
                      message: "Data Not Found",
                });
            }
            else
            {
                res.status(200).send(data[0]);
            }
          })
          .catch((err) => {
              return  res.status(500).send({
              message: err.message || "Some error occurred while retreving the Customer",
            }); 
      
          }); 
   // }
};
