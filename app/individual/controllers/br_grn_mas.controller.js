const db = require("../../central/models/user");
const Retailer =db.retailer
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.create = (req, res) => {
  const db1=req.ret_db
  const Br_grn_mas = db1.br_grn_mas;

  if (!req.body.br_grn_date) {
    res.status(400).send({
      message: "GRN Date can not be empty !",
    });
    return;
  }

  const br_grn_mas = {
    br_grn_date: req.body.br_grn_date,
    wh_so_mid: req.body.wh_so_mid,
    br_po_mid: req.body.br_po_mid,
    dept_id: req.body.dept_id,
    order_amount: req.body.order_amount,
    random_no: req.body.random_no,
    br_grn_remarks: req.body.br_grn_remarks,
    user_id: req.body.user_id,
    dept_id: req.body.dept_id,
    status:'0',
  };

  
    Br_grn_mas.findAll({
      where : {
        status:0,
        user_id:req.body.user_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          Br_grn_mas.create(br_grn_mas)
          .then((data) => {
          res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the GRN Master",
            });
          });
        }
        else
        {
           res.status(200).send(data[0]);
        }
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving GRN Master",
        });
      });
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Br_grn_mas = db1.br_grn_mas;

    Br_grn_mas.findAll()
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
        message: err.message || "Some error occured while retrieving GRN Master",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Br_grn_mas = db1.br_grn_mas;

  const id = req.params.id;
  Br_grn_mas.findByPk(id)
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
        message: "Error retrieving GRN Master with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_grn_mas = db1.br_grn_mas;

  const id = req.params.id;
  Br_grn_mas.update(req.body, {
    where: { br_grn_mid: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "GRN Master was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update GRN Master with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Br_grn_mas = db1.br_grn_mas;

  const id = req.params.id;

  Br_grn_mas.destroy({
    where: { br_grn_mid: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "GRN Master was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete GRN Master with id=${id}`,
      });
    }
  });
};

exports.updateSOMID = (req, res) => {
  const db1=req.ret_db
  const Br_grn_mas = db1.br_grn_mas;
  const Br_grn_det = db1.br_grn_det;

  const somid = req.params.somid;
  const grnmid = req.params.grnmid;
  Br_grn_det.findAll({
    where: {br_grn_mid:grnmid}
  })
    .then((data) => {
      if(!data.length)
        {
            if(req.params.provider=='warehouse')
            {
              Br_grn_mas.findAll({
                where:{wh_so_mid:somid}
              })
              .then((data) => {
                if(!data.length)
                {
                    Br_grn_mas.update({wh_so_mid:somid,br_po_mid:0}, {
                      where: { br_grn_mid: grnmid },
                    }).then((data) => {
                      if (data[0] != 0) {
                        res.status(200).send({
                          message: "GRN Master was updated successfully",
                        });
                      } else {
                        res.status(500).send({
                          message: `Cannot update GRN Master with id=${grnmid}`,
                        });
                      }
                    });
                }
                else
                {
                  res.status(203).send({
                    message: `Sorry! this Purchase Order is already assign to another GRN`,
                  });
                }
              })
              .catch((err) => {
                res.status(502).send({
                  message: err.message || "Some error occured while retrieving GRN Master",
                });
              });
            }
            else if(req.params.provider=='vendor')
            {
              Br_grn_mas.findAll({
                where:{br_po_mid:somid}
              })
              .then((data) => {
                if(!data.length)
                {
                    Br_grn_mas.update({br_po_mid:somid,wh_so_mid:0}, {
                      where: { br_grn_mid: grnmid },
                    }).then((data) => {
                      if (data[0] != 0) {
                        res.status(200).send({
                          message: "GRN Master was updated successfully",
                        });
                      } else {
                        res.status(500).send({
                          message: `Cannot update GRN Master with id=${grnmid}`,
                        });
                      }
                    });
                }
                else
                {
                  res.status(203).send({
                    message: `Sorry! this Purchase Order is already assign to another GRN`,
                  });
                }
              })
              .catch((err) => {
                res.status(502).send({
                  message: err.message || "Some error occured while retrieving GRN Master",
                });
              });
            }
        }
        else
        {
          res.status(203).send({
            message: `Sorry! this GRN is already inprogress with another Purchase Order`,
          });
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving GRN Master with id=" + grnmid,
      });
    });
};

exports.BGRN_Report = async (req, res) => {
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
  const Br_grn_mas = db1.br_grn_mas;

  if(req.body.deptid != '' && req.body.start != '' && req.body.end != '')
  {
    startdate=req.body.start+' 00:00:00.00 +00:00'
    enddate=req.body.end+' 23:59:59.00 +00:00'
    check = 
    {
      createdAt: 
      { 
        [Op.between]: [startdate,enddate] 
      },
      dept_id:req.body.deptid,
      status:1 
    }
  }
  else if(req.body.deptid != '')
  {
    check = 
    {
      dept_id:req.body.deptid,
      status:1 
    }
  }
  else if(req.body.start != '' && req.body.end != '')
  {
    startdate=req.body.start+' 00:00:00.00 +00:00'
    enddate=req.body.end+' 23:59:59.00 +00:00'
    check = 
    {
      createdAt: 
      {
        [Op.between]: [startdate,enddate] 
       
      },
      status:1 
    }
  }
  else
  {
    check = 
    {
      status:1 
    }
  }
  Br_grn_mas.findAll({
    where:check,
    include: [
      {
        model: db1.br_grn_det,
        as: 'br_grn_det',
        include: [
          {
            model: db.raw_material,
            as: 'br_grn_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_grn_dept'
      },
      {
        model:db.users,
        as:'br_grn_user'
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
      message: err.message || "Some error occured while retrieving GRN Master",
    });
  });
};

exports.Retailer_GRN = async (req, res) => {
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
  const Br_grn_mas = db1.br_grn_mas;

    Br_grn_mas.findAll({
      where:{status:1},
      include: [
        {
          model: db1.br_grn_det,
          as: 'br_grn_det',
          include: [
            {
              model: db.raw_material,
              as: 'br_grn_mat',
            }
          ]
    
        },
        {
          model:db.department_setup,
          as:'br_grn_dept'
        },
        {
          model:db.users,
          as:'br_grn_user'
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
        message: err.message || "Some error occured while retrieving GRN Master",
      });
    });
};