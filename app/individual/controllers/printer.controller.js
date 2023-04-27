const db = require("../../central/models/user");
const Retailer = db.retailer;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createPrinter': {
     return [ 
        body('dept_id', 'Dept is required').notEmpty(),
        body('dept_id', 'Dept value must be in integer').isInt(),
        body('till_id', 'till id is required').notEmpty(),
        body('till_id', 'till id value must be in integer').isFloat(),
        body('till_printer', 'Till printer is required').notEmpty(),
        body('kitchen_printer', 'Kitchen printer is required').notEmpty(),
       ]   
    }
    case 'updatePrinter': {
      return [ 
        body('dept_id', 'Dept is required').notEmpty(),
        body('dept_id', 'Dept value must be in integer').isInt(),
        body('till_id', 'till id is required').notEmpty(),
        body('till_id', 'till id value must be in integer').isFloat(),
        body('till_printer', 'Till printer is required').notEmpty(),
        body('kitchen_printer', 'Kitchen printer is required').notEmpty(),
        body('status', 'status is required').notEmpty(),
        body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}
exports.create = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    const printer_detail = {
    dept_id: req.body.dept_id,
    till_id: req.body.till_id,
    till_printer: req.body.till_printer,
    kitchen_printer: req.body.kitchen_printer,
    status:'1',
    };
    Printer_detail.findAll({
    where:{
        till_id: req.body.till_id,
    }
    })
    .then((data1) => {
    if(!data1.length)
    {
        Printer_detail.create(printer_detail)
        .then((data) => {
        res.status(200).send(data);
        })
        .catch((err) => {
            res.status(500).send({
            message: err.message || "Some error occurred while create the Raw Material",
            });
        });
    }
    else
    {
        Printer_detail.update({status:0}, {
            where: { till_id: req.body.till_id },
            }).then((data) => {
            if (data[0] != 0) {

                Printer_detail.create(printer_detail)
                .then((data) => {
                res.status(200).send(data);
                })
                .catch((err) => {
                    res.status(500).send({
                    message: err.message || "Some error occurred while create the Raw Material",
                    });
                });

            } else {
                res.status(500).send({
                message: `Cannot update Printer with id=${req.body.till_id}`,
                });
            }
            });
    }
    })
    .catch((err) => {
    res.status(500).send({
        message: "Error retrieving Printer with id=" + req.body.till_id,
    });
    });
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

    const deptid = req.params.deptid;
    Printer_detail.findAll({
      where:{dept_id:deptid,status:1},
      include: [
        {
          model: db.department_setup,
          as: 'dept_printer',
        },
        {
          model: db1.till_setup,
          as: 'till_print',
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
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};

exports.findAllTill = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

    const deptid = req.params.deptid;
    const tillid = req.params.tillid;
    Printer_detail.findAll({
      where:{dept_id:deptid,till_id:tillid,status:1},
      include: [
        {
          model: db.department_setup,
          as: 'dept_printer',
        },
        {
          model: db1.till_setup,
          as: 'till_print',
        } 
      ]
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
           res.status(200).send(data);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

    const deptid = req.params.deptid;
    Printer_detail.findAll({
      where:{dept_id:deptid},
      include: [
        {
          model: db.department_setup,
          as: 'dept_printer',
        },
        {
          model: db1.till_setup,
          as: 'till_print',
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
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

  const id = req.params.id;
  Printer_detail.findByPk(id,{
    include: [
        {
          model: db.department_setup,
          as: 'dept_printer',
        },
        {
          model: db1.till_setup,
          as: 'till_print',
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
        message: "Error retrieving Raw Material with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

  const id = req.params.id;
  
  Printer_detail.findAll({
    where:{
      till_id: req.body.till_id,
    }
  })
  .then((data1) => {
        if(!data1.length)
        {
          const printer_detail = {
            material_id: req.body.material_id,
            unit_or_weight: req.body.unit_or_weight,
            status:req.body.status,
          };
          Printer_detail.update(printer_detail, {
            where: { printer_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Raw Material was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Raw Material with id=${id}`,
              });
            }
          });
        }
        else{
          const printer_detail = {
            unit_or_weight: req.body.unit_or_weight,
            status:req.body.status,
          };
          Printer_detail.update(printer_detail, {
            where: { printer_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Raw Material was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Raw Material with id=${id}`,
              });
            }
          });
        }
    });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Printer_detail = db1.printer_detail;

  const id = req.params.id;
  Printer_detail.destroy({
    where: { printer_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Raw Material was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Raw Material with id=${id}`,
      });
    }
  });
};

exports.Retailer_printer = async (req, res) => {
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
  const Printer_detail = db1.printer_detail;

    const deptid = req.body.deptid;
    Printer_detail.findAll({
      where:{dept_id:deptid},
      include: [
        {
          model: db.department_setup,
          as: 'dept_printer',
        },
        {
          model: db1.till_setup,
          as: 'till_print',
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
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};
