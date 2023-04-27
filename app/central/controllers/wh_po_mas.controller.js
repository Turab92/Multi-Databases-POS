const db = require("../models/user");
const Wh_po_mas = db.wh_po_mas;
const Wh_po_det = db.wh_po_det;
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.wh_po_date) {
    res.status(400).send({
      message: "PO can not be empty !",
    });
    return;
  }

  const wh_po_mas = {
    wh_po_date: req.body.wh_po_date,
    wh_pr_mid: req.body.wh_pr_mid,
    wh_purchase_term: req.body.wh_purchase_term,
    vendor_id: req.body.vendor_id,
    order_amount: req.body.order_amount,
    random_no: req.body.random_no,
    po_remarks: req.body.po_remarks,
    user_id: req.body.user_id,
    dept_id: req.body.dept_id,
    status:'0',
  };

 
    Wh_po_mas.findAll({
      where : {
        status:0,
        user_id:req.body.user_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          Wh_po_mas.create(wh_po_mas)
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
    Wh_po_mas.findAll()
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
  const id = req.params.id;
  Wh_po_mas.findByPk(id)
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
  const id = req.params.id;
  Wh_po_det.findAll({
    where: {wh_po_mid:id}
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
          Wh_po_mas.update(req.body, {
            where: { wh_po_mid: id },
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
  const prmid = req.params.prmid;
  const pomid = req.params.pomid;
  Wh_po_det.findAll({
    where: {wh_po_mid:pomid}
  })
    .then((data) => {
      if(!data.length)
        {
          Wh_po_mas.findAll({
            where:{wh_pr_mid:prmid}
          })
          .then((data) => {
            if(!data.length)
            {
                Wh_po_mas.update({wh_pr_mid:prmid}, {
                  where: { wh_po_mid: pomid },
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
  const id = req.params.id;

  Wh_po_mas.destroy({
    where: { wh_po_mid: id },
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
  Wh_po_mas.findAll({
    where:{
      wh_po_mid:{
        [sequelize.Op.notIn]:sequelize.literal(`(SELECT g.wh_po_mid FROM wh_grn_masters g join wh_po_masters o on g.wh_po_mid=o.wh_po_mid)`)
         
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

exports.WPO_Report = (req, res) => {
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
  Wh_po_mas.findAll({
    where:check,
    include: [
      {
        model: db.wh_po_det,
        as: 'wh_po_det',
        include: [
          {
            model: db.raw_material,
            as: 'po_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'wh_po_dept'
      },
      {
        model:db.wh_vendor_setup,
        as:'wh_vendor'
      },
      {
        model:db.users,
        as:'wh_po_user'
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
