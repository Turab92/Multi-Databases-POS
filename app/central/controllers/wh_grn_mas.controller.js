const db = require("../models/user");
const Wh_grn_mas = db.wh_grn_mas;
const Wh_grn_det = db.wh_grn_det;
const sequelize = require("sequelize");
const Op = sequelize.Op;


exports.create = (req, res) => {
  if (!req.body.wh_grn_date) {
    res.status(400).send({
      message: "GRN Date can not be empty !",
    });
    return;
  }

  const wh_grn_mas = {
    wh_grn_date: req.body.wh_grn_date,
    wh_po_mid: req.body.wh_po_mid,
    order_amount: req.body.order_amount,
    random_no: req.body.random_no,
    grn_remarks: req.body.grn_remarks,
    user_id: req.body.user_id,
    dept_id: req.body.dept_id,
    status:'0',
  };

  
    Wh_grn_mas.findAll({
      where : {
        status:0,
        user_id:req.body.user_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          Wh_grn_mas.create(wh_grn_mas)
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
    Wh_grn_mas.findAll()
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
  const id = req.params.id;
  Wh_grn_mas.findByPk(id)
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
  const id = req.params.id;

  Wh_grn_mas.update(req.body, {
    where: { wh_grn_mid: id },
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
  const id = req.params.id;

  Wh_grn_mas.destroy({
    where: { wh_grn_mid: id },
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

exports.updatePOMID = (req, res) => {
  const pomid = req.params.pomid;
  const grnmid = req.params.grnmid;
  Wh_grn_det.findAll({
    where: {wh_grn_mid:grnmid}
  })
    .then((data) => {
      if(!data.length)
        {
          Wh_grn_mas.findAll({
            where:{wh_po_mid:pomid}
          })
          .then((data) => {
            if(!data.length)
            {
                Wh_grn_mas.update({wh_po_mid:pomid}, {
                  where: { wh_grn_mid: grnmid },
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

exports.WGRN_Report = (req, res) => {
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
  Wh_grn_mas.findAll({
    where:check,
    include: [
      {
        model: db.wh_grn_det,
        as: 'wh_grn_det',
        include: [
          {
            model: db.raw_material,
            as: 'grn_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'wh_grn_dept'
      },
      {
        model:db.users,
        as:'wh_grn_user'
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

