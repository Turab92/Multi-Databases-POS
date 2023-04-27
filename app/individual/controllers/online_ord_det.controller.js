const db = require("../../central/models/user");

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Online_ord_det = db1.online_ord_det;
  const Subpro_rate_setup = db1.subpro_rate_setup;

  var data = await Subpro_rate_setup.findAll({
    where: { sub_pro_id: req.params.subid, status: 1 },
  });
  if (!data.length) {
    res.status(202).send({
      message: "Sub product rate not found",
    });
  }
  var tot = data[0].dataValues.net_rate * 1;
  var disc;
  if (data[0].dataValues.discount != 0) {
    disc = (tot / 100) * data[0].dataValues.discount;
  } else {
    disc = 0;
  }
  const online_ord_det = {
    on_om_id: req.params.on_om_id,
    dept_id: req.params.dept_id,
    main_pro_id: null,
    sub_pro_id: req.params.subid,
    price: data[0].dataValues.net_rate,
    quantity: 1,
    discount: disc,
    total: tot,
    net_total: tot - disc,
    status: "0",
  };
  
      var data4 = await Online_ord_det.create(online_ord_det);
      return res.status(200).send(data4);
};

exports.create2 = async (req, res) => {
  var data = await deal_setup.findByPk(req.params.dealid);
  const online_ord_det = {
    on_om_id: req.params.om_id,
    dept_id: req.params.dept_id,
    main_pro_id: null,
    ds_id: data.ds_id,
    price: data.price,
    discount:0,
    quantity: 1,
    total: data.price * 1,
    net_total:data.price * 1,
    status: "0",
  };
        var data3 = await Online_ord_det.create(online_ord_det);
        
        return  res.status(200).send(data3);
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Online_ord_det = db1.online_ord_det;
  const Online_ord_mas = db1.online_ord_mas;

  let userid = req.params.id;
  Online_ord_mas.findAll({
    where: { user_id: userid, status: 0 },
  })
    .then((data) => {
      if (data.length != 0) {
        Online_ord_det.findAll({
          where: { on_om_id: data[0].om_id, status: 0 },
          include: [
            {
              model: db1.sub_products,
              as: "sub_products",
            },
            {
              model: db1.deal_setup,
              as: "deal_setups",
            },
          ],
        })
          .then((data) => {
            if (!data.length) {
              res.status(500).send({
                message: "Data Not Found",
              });
            } else {
              res.status(200).send(data);
            }
          })
          .catch((err) => {
            res.status(502).send({
              message:
                err.message ||
                "Some error occured while retrieving Order Detail",
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while create the Order Master",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Online_ord_det = db1.online_ord_det;

  const id = req.params.id;
  Online_ord_det.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(500).send({
          message: "Sorry! Data Not Found With Id=" + id,
        });
      } else {
        res.status(200).send(data);
      }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Order Detail with id=" + id,
      });
    });
};

exports.update = async (req, res) => {
  const db1=req.ret_db
  const Online_ord_det = db1.online_ord_det;
  const deal_setup = db1.deal_setup;
  const Subpro_rate_setup = db1.subpro_rate_setup;

  const id = req.params.id;
  var data = await Online_ord_det.findByPk(id);//findone or findByPK return object
  
  if(data.ds_id==null)
  {
    var data5 = await Subpro_rate_setup.findAll({
      where: { sub_pro_id: data.sub_pro_id, status: 1 },
    });
    if (!data5.length) {
      res.status(202).send({
        message: "Sub product rate not found",
      });
    }
    var tot = data5[0].dataValues.net_rate * req.body.quantity;
    var disc;
    if (data5[0].dataValues.discount != 0) {
      disc = (tot / 100) * data5[0].dataValues.discount;
    } else {
      disc = 0;
    }
    const online_ord_det = {
      quantity: req.body.quantity,
      discount: disc,
      total: tot,
      net_total: tot - disc
    };
     
        var data4 = await Online_ord_det.update(online_ord_det,{
          where: { od_id: id }
        });
    
        return res.status(200).send(data4);
      
    
  }
  else if(data.sub_pro_id==null)
  {
    var data1 = await deal_setup.findByPk(data.ds_id);
      const online_ord_det = {
        quantity: req.body.quantity,
        total: data1.price * req.body.quantity,
        net_total:data1.price * req.body.quantity,
      };
        var data3 = await Online_ord_det.update(online_ord_det,{
            where: { od_id: id }
        });
        
        return  res.status(200).send(data3);
          
    }
 
};


exports.update_detail = (req, res) => {
  const db1=req.ret_db
  const Online_ord_det = db1.online_ord_det;

  const id = req.params.id;
  Online_ord_det.update(req.body, {
    where: { on_om_id: id },
  }).then((data) => {
    if (data[0] != 0) {
        res.status(200).send({
            message: `Data update successfully`,
          });
    } else {
      res.status(500).send({
        message: `Cannot update Order Detail with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Online_ord_det = db1.online_ord_det;

  const odid = req.params.odid;
  const omid = req.params.omid;

  Online_ord_det.findAll({
    where: { on_om_id: omid },
  })
    .then((data) => {
      if (data.length == 1) {
        res.status(502).send({
          message: `Sorry you cannot delete last detail of this other`,
        });
      } else {
        Online_ord_det.destroy({
          where: { od_id: odid },
        }).then((data) => {
          if (data) {
            res.status(200).send({
                message: `Data update successfully`,
              });
          } else {
            res.status(500).send({
              message: `Cannot delete Order Detail with id=${odid}`,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving Order Detail",
      });
    });
};
