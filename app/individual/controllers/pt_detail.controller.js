const db = require("../../central/models/user");
const { body,validationResult  } = require('express-validator');

// exports.validate = (method) => {
//   switch (method) {
//     case 'createPT': {
//      return [ 
//         body('pay_type_id', 'Payment type is required').notEmpty(),
//         body('pay_type_id', 'Payment type value must be in integer').isInt(),
//         body('cus_id', 'Customer value must be in integer').isInt(),
//         body('card_no', 'Card no value must be in integer').isInt(),
//         body('cash_received', 'Cash Received value must be in integer').isInt(),
//         body('cash_return', 'Cash Return value must be in integer').isInt(),
//         body('per_email', 'Invalid email').isEmail(),
//         body('per_phone', 'Invalid phone number').optional().isInt(),
//         body('per_phone', 'Minimum 10 and Maximum 12 number required in Phone number').isLength({ min: 10 ,max: 12 }),
//        ]   
//     }
//   }
// }

exports.create = (req, res) => {
  const db1=req.ret_db
  const Pay_type_detail = db1.pay_type_detail;
  const Order_master = db1.order_master;

  
      let omid = req.body.om_id;
      const paym_type_detail = {
        pay_type_id: req.body.pay_type_id,
        cus_id: req.body.cus_id,
        card_no: req.body.card_no,
        card_type: req.body.card_type,
        acc_title: req.body.acc_title,
        bank_name: req.body.bank_name,
        per_name: req.body.per_name,
        per_phone: req.body.per_phone,
        per_email: req.body.per_email,
        reason: req.body.reason,
        cash_received: req.body.cash_received,
        cash_return: req.body.cash_return,
        status:'1',
      };

        Order_master.findAll({
          where: { om_id: omid },
          })
            .then((data) => {
            if((data[0].pt_de_id ==null) || (data[0].pt_de_id ==''))
            {
              Pay_type_detail.create(paym_type_detail)
                .then((data) => {
                  const ord_mas_pt = {
                    pt_de_id: data.pt_d_id,
                  };
                  Order_master.update(ord_mas_pt, {
                    where: { om_id: omid },
                  }).then((data) => {
                    if (data[0] != 0) {
                      res.status(200).send({
                        message: "Payment Type updated successfully in order master",
                      });
                    } else {
                      res.status(500).send({
                        message: `Cannot update Payment Type in Order Master with id=${omid}`,
                      });
                    }
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some error occurred while create the Payment type detail",
                  });
                });
            } 
            else
            {
              Pay_type_detail.update(paym_type_detail, {
                  where: { pt_d_id: data[0].pt_de_id },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Payment type detail was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot Payment type detail with id=${id}`,
                    });
                  }
                });
            }
              
            })
            .catch((err) => {
                return  res.status(500).send({
                message: err.message || "Some error occurred while retreving the Order Master",
              }); 
        
            }); 
    
};

exports.create1 = (req, res) => {
  const db1=req.ret_db
  const Pay_type_detail = db1.pay_type_detail;
  const Mart_ord_mas = db1.mart_ord_mas;

      let omid = req.body.m_om_id;
      const paym_type_detail = {
        pay_type_id: req.body.pay_type_id,
        cus_id: req.body.cus_id,
        card_no: req.body.card_no,
        card_type: req.body.card_type,
        acc_title: req.body.acc_title,
        bank_name: req.body.bank_name,
        per_name: req.body.per_name,
        per_phone: req.body.per_phone,
        per_email: req.body.per_email,
        reason: req.body.reason,
        cash_received: req.body.cash_received,
        cash_return: req.body.cash_return,
        status:'1',
      };

        Mart_ord_mas.findAll({
          where: { m_om_id: omid },
          })
            .then((data) => {
            if((data[0].pt_de_id ==null) || (data[0].pt_de_id ==''))
            {
              Pay_type_detail.create(paym_type_detail)
                .then((data) => {
                  const ord_mas_pt = {
                    pt_de_id: data.pt_d_id,
                  };
                  Mart_ord_mas.update(ord_mas_pt, {
                    where: { m_om_id: omid },
                  }).then((data) => {
                    if (data[0] != 0) {
                      res.status(200).send({
                        message: "Payment Type updated successfully in order master",
                      });
                    } else {
                      res.status(500).send({
                        message: `Cannot update Payment Type in Order Master with id=${omid}`,
                      });
                    }
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some error occurred while create the Payment type detail",
                  });
                });
            } 
            else
            {
              Pay_type_detail.update(paym_type_detail, {
                  where: { pt_d_id: data[0].pt_de_id },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Payment type detail was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot Payment type detail with id=${data[0].pt_de_id}`,
                    });
                  }
                });
            }
              
            })
            .catch((err) => {
                return  res.status(500).send({
                message: err.message || "Some error occurred while retreving the Order Master",
              }); 
        
            }); 
  
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Pay_type_detail = db1.pay_type_detail;

    Pay_type_detail.findAll()
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
        message: err.message || "Some error occured while retrieving Payment Type Detail",
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
          model: db1.pay_type_detail,
          as: 'pt_details'
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
        message: err.message || "Some error occured while retrieving payment type detail",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Pay_type_detail = db1.pay_type_detail;

  const id = req.params.id;
  Pay_type_detail.findByPk(id)
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
        message: "Error retrieving Payment Type Detail with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Pay_type_detail = db1.pay_type_detail;

  const id = req.params.id;
  Pay_type_detail.update(req.body, {
    where: { pt_d_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Payment Type Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Payment Type Detail with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Pay_type_detail = db1.pay_type_detail;

  const id = req.params.id;
  Pay_type_detail.destroy({
    where: { pt_d_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Payment Type Detail was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Payment Type Detail with id=${id}`,
      });
    }
  });
};


