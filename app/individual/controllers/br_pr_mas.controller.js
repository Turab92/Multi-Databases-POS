const db = require("../../central/models/user");
const Department_setup = db.department_setup;
const Retailer =db.retailer
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.create = (req, res) => {
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

  if (!req.body.br_pr_date) {
    res.status(400).send({
      message: "Purchase request date can not be empty !",
    });
    return;
  }
  
    Br_pr_mas.findAll({
      where : {
        status:0,
        user_id:req.body.user_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
             
            const br_pr_mas = {
            br_pr_date: req.body.br_pr_date,
            br_purchase_term: req.body.br_purchase_term,
            dept_id: req.body.dept_id,
            total_amount: req.body.total_amount,
            random_no: req.body.random_no,
            br_pr_remarks: req.body.br_pr_remarks,
            user_id: req.body.user_id,
            provider: req.body.provider,
            status:'0',
          };
          Br_pr_mas.create(br_pr_mas)
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
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

    Br_pr_mas.findAll()
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
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

  const id = req.params.id;
  Br_pr_mas.findByPk(id)
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

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

  const id = req.params.id;
  if(req.body.provider=='warehouse')
    {
    Department_setup.findAll({
      where:{dept_id:req.body.dept_id}
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
        
          const br_pr_mas = {
          br_pr_date: req.body.br_pr_date,
          br_pr_remarks: req.body.br_pr_remarks,
          parent_dept_id: data[0].dataValues.parent_dept_id,
          status:req.body.status
        };
        Br_pr_mas.update(br_pr_mas, {
          where: { br_pr_mid: id },
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
    }
    else if(req.body.provider=='vendor')
    {
          const br_pr_mas = {
            br_pr_date: req.body.br_pr_date,
            br_pr_remarks: req.body.br_pr_remarks,
            status:req.body.status
        };
        Br_pr_mas.update(br_pr_mas, {
          where: { br_pr_mid: id },
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

};

exports.update2 = (req, res) => {
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

  const id = req.params.id;

        Br_pr_mas.update(req.body, {
          where: { br_pr_mid: id },
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

};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

  const id = req.params.id;

  Br_pr_mas.destroy({
    where: { br_pr_mid: id },
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

exports.findReq = async (req, res) => {
  var retailer = await Retailer.findByPk(req.params.retailer_id)
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
  const Br_pr_mas = db1.br_pr_mas;

  Br_pr_mas.findAll({
    where:{
      br_pr_mid:{
        [sequelize.Op.notIn]:sequelize.literal(`(SELECT g.br_pr_mid FROM wh_so_masters g join br_pr_masters o on g.br_pr_mid=o.br_pr_mid)`)
      },
      status:1,
      parent_dept_id:req.params.dept_id,
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

exports.findReq2 = (req, res) => {
  const db1=req.ret_db
  const Br_pr_mas = db1.br_pr_mas;

  Br_pr_mas.findAll({
    where:{
      br_pr_mid:{
        [sequelize.Op.notIn]:sequelize.literal(`(SELECT g.br_pr_mid FROM br_po_masters g join br_pr_masters o on g.br_pr_mid=o.br_pr_mid)`)
      },
      status:1,
      dept_id:req.params.dept_id,
      parent_dept_id:null,
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

exports.findData = async (req, res) => {
  var retailer = await Retailer.findByPk(req.params.retailer_id)
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
  const Br_pr_mas = db1.br_pr_mas;

  const reqid = req.params.reqid;
  Br_pr_mas.findAll({
    where:{
      br_pr_mid:reqid
    },
    include: [
      {
        model: db1.br_pr_det,
        as: 'br_pr_det',
        include: [
          {
            model: db.raw_material,
            as: 'br_pr_mat',
          }
        ]
      },
      {
        model: db.department_setup,
        as: 'requested_dept'
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

exports.BPR_Report = async (req, res) => {
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
  const Br_pr_mas = db1.br_pr_mas;

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
  Br_pr_mas.findAll({
    where:check,
    include: [
      {
        model: db1.br_pr_det,
        as: 'br_pr_det',
        include: [
          {
            model: db.raw_material,
            as: 'br_pr_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'br_pr_dept'
      },
      {
        model:db.department_setup,
        as:'br_pr_par_dept'
      },
      {
        model:db.users,
        as:'br_pr_user'
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

exports.Retailer_PR = async (req, res) => {
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
  const Br_pr_mas = db1.br_pr_mas;

    Br_pr_mas.findAll({
      where:{status:1},
      include: [
        {
          model: db1.br_pr_det,
          as: 'br_pr_det',
          include: [
            {
              model: db.raw_material,
              as: 'br_pr_mat',
            }
          ]
    
        },
        {
          model:db.department_setup,
          as:'br_pr_dept'
        },
        {
          model:db.department_setup,
          as:'br_pr_par_dept'
        },
        {
          model:db.users,
          as:'br_pr_user'
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