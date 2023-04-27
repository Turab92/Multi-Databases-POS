const db = require("../models/user");
const Wh_so_mas = db.wh_so_mas;
const Wh_so_det = db.wh_so_det;
const Retailer =db.retailer
const sequelize = require("sequelize");
const Op = sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.wh_so_date) {
    res.status(400).send({
      message: "Date can not be empty !",
    });
    return;
  }

  const wh_so_mas = {
    wh_so_date: req.body.wh_so_date,
    br_pr_mid: req.body.br_pr_mid,
    so_purchase_term: req.body.so_purchase_term,
    order_amount: req.body.order_amount,
    random_no: req.body.random_no,
    so_remarks: req.body.so_remarks,
    user_id: req.body.user_id,
    dept_id: req.body.dept_id,
    par_dept_id: req.body.par_dept_id,
    client_id: req.body.client_id,
    status:'0',
  };

  
    Wh_so_mas.findAll({
      where : {
        status:0,
        user_id:req.body.user_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          Wh_so_mas.create(wh_so_mas)
          .then((data) => {
           res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Sale Order Master",
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
          message: err.message || "Some error occured while retrieving Sale Order Master",
        });
      });
};

exports.findAll = (req, res) => {
    Wh_so_mas.findAll()
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
        message: err.message || "Some error occured while retrieving Sale Order Master",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Wh_so_mas.findByPk(id)
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
        message: "Error retrieving Sale Order Master with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Wh_so_det.findAll({
    where: {wh_so_mid:id}
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(400).send({
                   message: "Sorry! Data Not Found in Sale Detail With this Sale Master Id=" + id,
              });
        }
        else
        {
           Wh_so_mas.update(req.body, {
            where: { wh_so_mid: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Sale Order Master was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Sale Order Master with id=${id}`,
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

  Wh_so_mas.destroy({
    where: { wh_so_mid: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Sale Order Master was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Sale Order Master with id=${id}`,
      });
    }
  });
};


exports.findReq = async (req, res) => {
 var data = await Wh_so_mas.findAll({
    where:{
      // wh_so_mid:{
      //   [sequelize.Op.notIn]:sequelize.literal(`(SELECT g.wh_so_mid FROM br_grn_masters g join wh_so_masters o on g.wh_so_mid=o.wh_so_mid)`)
        
      // },
      status:1,
      dept_id:req.params.dept_id
    },
    raw: true,
  })
    if(!data.length)
    {
       res.status(500).send({
               message: "Data Not Found",
          });
    }
    else
    {
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
       var arr=[];
      const db1=req.cur_ret_db
      const Br_grn_mas = db1.br_grn_mas;
      var br_data= await Br_grn_mas.findAll({
        where : {
          br_po_mid:0,
          dept_id:req.params.dept_id
        },
        raw: true,
      })
          if(!br_data.length)
          {
            res.status(200).send(data);
          }
          else
          {
            // for(var det of data){
            //   var boolValue = br_data.includes((element)=> element.wh_so_mid == det.dataValues.wh_so_mid);
            //   if(boolValue == false)
            //   {
            //     arr.push(det)
            //   }
            // }
            function getDifference(array1, array2) {
              return array1.filter(object1 => {
                return !array2.some(object2 => {
                  return object1.wh_so_mid === object2.wh_so_mid;
                });
              });
            }
            var dat =getDifference(data, br_data)
            console.log(getDifference(data, br_data));
            res.status(200).send(dat);
          }
        
       
    }

};

exports.updatePRMID = (req, res) => {
  const prmid = req.params.prmid;
  const somid = req.params.somid;
  Wh_so_det.findAll({
    where: {wh_so_mid:somid}
  })
    .then((data) => {
      if(!data.length)
        {
          Wh_so_mas.findAll({
            where:{br_pr_mid:prmid}
          })
          .then((data) => {
            if(!data.length)
            {
                Wh_so_mas.update({br_pr_mid:prmid}, {
                  where: { wh_so_mid: somid },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Sale Order Master was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Sale Order Master with id=${somid}`,
                    });
                  }
                });
            }
            else
            {
              res.status(203).send({
                message: `Sorry! this Purchase Request is already assign to another Sale order`,
              });
            }
          })
          .catch((err) => {
            res.status(502).send({
              message: err.message || "Some error occured while retrieving Sale Order Master",
            });
          });
        }
        else
        {
          res.status(203).send({
            message: `Sorry! this Sale Order is already inprogress with another purchase request`,
          });
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Sale Order Master with id=" + somid,
      });
    });
};


exports.findData = (req, res) => {
  const somid = req.params.somid;
  Wh_so_mas.findAll({
    where:{
      wh_so_mid:somid
    },
    include: [
      {
        model: db.wh_so_det,
        as: 'wh_so_det',
        include: [
          {
            model: db.raw_material,
            as: 'so_mat',
          }
        ]
  
      },
      {
        model: db.department_setup,
        as: 'so_dept',
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


exports.WSO_Report = (req, res) => {
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
       par_dept_id:req.body.deptid,
      status:1 
    }
  }
  else if(req.body.deptid != '')
  {
    check = 
    {
       par_dept_id:req.body.deptid,
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
  Wh_so_mas.findAll({
    where:check,
    include: [
      {
        model: db.wh_so_det,
        as: 'wh_so_det',
        include: [
          {
            model: db.raw_material,
            as: 'so_mat',
          }
        ]
  
      },
      {
        model:db.department_setup,
        as:'wh_so_dept'
      },
      {
        model:db.department_setup,
        as:'wh_so_par_dept'
      },
      {
        model:db.users,
        as:'wh_so_user'
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
      message: err.message || "Some error occured while retrieving Sale Order Master",
    });
  });
};

