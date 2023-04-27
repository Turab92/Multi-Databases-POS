const db = require("../models/user");
const Wh_pr_mas = db.wh_pr_mas;
const Wh_pr_det = db.wh_pr_det;
const sequelize = require("sequelize");
const Op = sequelize.Op;


exports.create = (req, res) => {
  if (!req.body.wh_pr_date) {
    res.status(400).send({
      message: "Purchase request date can not be empty !",
    });
    return;
  }

  const wh_pr_mas = {
    wh_pr_date: req.body.wh_pr_date,
    wh_purchase_term: req.body.wh_purchase_term,
    vendor_id: req.body.vendor_id,
    total_amount: req.body.total_amount,
    random_no: req.body.random_no,
    remarks: req.body.remarks,
    user_id: req.body.user_id,
    dept_id: req.body.dept_id,
    status:'0',
  };
  Wh_pr_mas.findAll({
    where : {
      status:0,
      user_id:req.body.user_id
    }
  })
    .then((data) => {
      if(!data.length)
      {
        Wh_pr_mas.create(wh_pr_mas)
        .then((data) => {
         res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while create the Purchase Request Master",
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
        message: err.message || "Some error occured while retrieving Purchase Request Master",
      });
    });
};

exports.findAll = (req, res) => {
    Wh_pr_mas.findAll()
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

exports.findOne = (req, res) => {
  const id = req.params.id;
  Wh_pr_mas.findByPk(id)
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
        message: "Error retrieving Purchase Request Master with id=" + id,
      });
    });
};

exports.findReq = (req, res) => {
  Wh_pr_mas.findAll({
    where:{
      wh_pr_mid:{
        [sequelize.Op.notIn]:sequelize.literal(`(SELECT o.wh_pr_mid FROM wh_po_masters o join wh_pr_masters r on o.wh_pr_mid=r.wh_pr_mid)`)
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

exports.update = (req, res) => {
  const id = req.params.id;
  Wh_pr_det.findAll({
    where: {wh_pr_mid:id}
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
          Wh_pr_mas.update(req.body, {
            where: { wh_pr_mid: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Purchase Request Master was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Purchase Request Master with id=${id}`,
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

exports.delete = (req, res) => {
  const id = req.params.id;

  Wh_pr_mas.destroy({
    where: { wh_pr_mid: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Purchase Request Master was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Purchase Request Master with id=${id}`,
      });
    }
  });
};

exports.findData = (req, res) => {
  const reqid = req.params.reqid;
  Wh_pr_mas.findAll({
    where:{
      wh_pr_mid:reqid
    },
    include: [
      {
        model: db.wh_pr_det,
        as: 'wh_pr_det',
        include: [
          {
            model: db.raw_material,
            as: 'pr_mat',
          }
        ]
  
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

exports.WPR_Report = (req, res) => {
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
  Wh_pr_mas.findAll({
    where:check,
    include: [
      {
        model: db.wh_pr_det,
        as: 'wh_pr_det',
        include: [
          {
            model: db.raw_material,
            as: 'pr_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'wh_pr_dept'
      },
      {
        model:db.users,
        as:'wh_pr_user'
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