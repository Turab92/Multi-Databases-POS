const db = require("../../central/models/user");
const Retailer =db.retailer
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.create = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;

  if (!req.body.br_po_date) {
    res.status(400).send({
      message: "PO can not be empty !",
    });
    return;
  }

  const br_po_mas = {
    br_po_date: req.body.br_po_date,
    br_pr_mid: req.body.br_pr_mid,
    br_purchase_term: req.body.br_purchase_term,
    vendor_id: req.body.vendor_id,
    order_amount: req.body.order_amount,
    random_no: req.body.random_no,
    po_remarks: req.body.po_remarks,
    user_id: req.body.user_id,
    dept_id: req.body.dept_id,
    status:'0',
  };

 
    Br_po_mas.findAll({
      where : {
        status:0,
        user_id:req.body.user_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          Br_po_mas.create(br_po_mas)
          .then((data) => {
           res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Purchase Order Master",
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
          message: err.message || "Some error occured while retrieving Purchase Order Master",
        });
      });
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;

    Br_po_mas.findAll()
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
        message: err.message || "Some error occured while retrieving Purchase Order Master",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;

  const id = req.params.id;
  Br_po_mas.findByPk(id)
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
        message: "Error retrieving Purchase Order Master with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;
  const Br_po_det = db1.br_po_det;

  const id = req.params.id;
  Br_po_det.findAll({
    where: {br_po_mid:id}
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(400).send({
                   message: "Sorry! Data Not Found in Purchase Detail With this Purchase Master Id=" + id,
              });
        }
        else
        {
          Br_po_mas.update(req.body, {
            where: { br_po_mid: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Purchase Order Master was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Purchase Order Master with id=${id}`,
              });
            }
          });
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Purchase Request Master with id=" + id,
      });
    });
};

exports.updatePRMID = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;
  const Br_po_det = db1.br_po_det;

  const prmid = req.params.prmid;
  const pomid = req.params.pomid;
  Br_po_det.findAll({
    where: {br_po_mid:pomid}
  })
    .then((data) => {
      if(!data.length)
        {
          Br_po_mas.findAll({
            where:{br_pr_mid:prmid}
          })
          .then((data) => {
            if(!data.length)
            {
                Br_po_mas.update({br_pr_mid:prmid}, {
                  where: { br_po_mid: pomid },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Purchase Order Master was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Purchase Order Master with id=${pomid}`,
                    });
                  }
                });
            }
            else
            {
              res.status(203).send({
                message: `Sorry! this Purchase Request is already assign to another purchase order`,
              });
            }
          })
          .catch((err) => {
            res.status(502).send({
              message: err.message || "Some error occured while retrieving Purchase Order Master",
            });
          });
        }
        else
        {
          res.status(203).send({
            message: `Sorry! this Purchase Order is already inprogress with another purchase request`,
          });
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Purchase Order Master with id=" + pomid,
      });
    });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;

  const id = req.params.id;
  Br_po_mas.destroy({
    where: { br_po_mid: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Purchase Order Master was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Purchase Order Master with id=${id}`,
      });
    }
  });
};

exports.findReq = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;

  Br_po_mas.findAll({
    where:{
      br_po_mid:{
        [sequelize.Op.notIn]:sequelize.literal(`(SELECT g.br_po_mid FROM br_grn_masters g join br_po_masters o on g.br_po_mid=o.br_po_mid)`)
         
      },
      status:1,
      dept_id:req.params.dept_id,
    }
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
      message: err.message || "Some error occured while retrieving Purchase Request Master",
    });
  });
};
exports.findData = (req, res) => {
  const db1=req.ret_db
  const Br_po_mas = db1.br_po_mas;

  const somid = req.params.somid;
  Br_po_mas.findAll({
    where:{
      br_po_mid:somid
    },
    include: [
      {
        model: db1.br_po_det,
        as: 'br_po_det',
        include: [
          {
            model: db.raw_material,
            as: 'br_po_mat',
          }
        ]
  
      },
      {
        model: db.department_setup,
        as: 'br_po_dept',
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
      message: err.message || "Some error occured while retrieving Purchase Request Master",
    });
  });
};

exports.BPO_Report = async (req, res) => {
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
  const Br_po_mas = db1.br_po_mas;

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
  Br_po_mas.findAll({
    where:check,
    include: [
      {
        model: db1.br_po_det,
        as: 'br_po_det',
        include: [
          {
            model: db.raw_material,
            as: 'br_po_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_po_dept'
      },
      {
        model:db1.vendor_setup,
        as:'br_po_vendor'
      },
      {
        model:db.users,
        as:'br_po_user'
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
      message: err.message || "Some error occured while retrieving Purchase Order Master",
    });
  });
};

exports.Retailer_PO = async (req, res) => {
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
  const Br_po_mas = db1.br_po_mas;

    Br_po_mas.findAll({
      where:{status:1},
      include: [
        {
          model: db1.br_po_det,
          as: 'br_po_det',
          include: [
            {
              model: db.raw_material,
              as: 'br_po_mat',
            }
          ]
    
        },
        {
          model:db.department_setup,
          as:'br_po_dept'
        },
        {
          model:db1.vendor_setup,
          as:'br_po_vendor'
        },
        {
          model:db.users,
          as:'br_po_user'
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
        message: err.message || "Some error occured while retrieving Purchase Order Master",
      });
    });
};