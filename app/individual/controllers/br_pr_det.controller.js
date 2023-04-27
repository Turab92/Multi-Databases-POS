const db = require("../../central/models/user");
const Retailer =db.retailer
exports.create = (req, res) => {
  const db1=req.ret_db
  const Br_pr_det = db1.br_pr_det;

  if (!req.body.br_pr_mid) {
    res.status(400).send({
      message: "Request Master id can not be empty !",
    });
    return;
  }

  const br_pr_det = {
    br_pr_mid: req.body.br_pr_mid,
    material_id: req.body.material_id,
    br_qty: req.body.br_qty,
    dept_id: req.body.dept_id,
    status:'0',
  };

  
    Br_pr_det.findAll({
      where:{
        br_pr_mid: req.body.br_pr_mid,
        material_id: req.body.material_id
      }
    })
      .then((data) => {
        if(!data.length)
        {
          
          Br_pr_det.create(br_pr_det)
          .then((data) => {
           res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Purchase Request Detail",
            });
          });
        }
        else
        {
          res.status(409).send({
            message: "Material Already Exist with this Purchase Request Master id"+req.body.br_pr_mid,
           });
        }
      })
      .catch((err) => {
        res.status(502).send({
          message: err.message || "Some error occured while retrieving Purchase Request Detail",
        });
      }); 
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Br_pr_det = db1.br_pr_det;

    Br_pr_det.findAll()
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
        message: err.message || "Some error occured while retrieving Purchase Request Detail",
      });
    });
};

exports.findOne = async (req, res) => {
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
  const Br_pr_det = db1.br_pr_det;

  const id = req.params.id;
  Br_pr_det.findByPk(id)
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
        message: "Error retrieving Purchase Request Detail with id=" + id,
      });
    });
};

exports.findMas = (req, res) => {
  const db1=req.ret_db
  const Br_pr_det = db1.br_pr_det;

  const mas_id = req.params.mas_id;
  Br_pr_det.findAll({
    where: {br_pr_mid:mas_id},
    
      include: [
        {
          model: db.raw_material,
          as: 'br_pr_mat'
    
        }
      ]
    
  })
    .then((data) => {
      if(!data.length)
        {
           res.status(204).send({
                   message: "Sorry! Data Not Found With Id=" + mas_id,
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
    .catch((err) => {
      res.status(502).send({
        message: "Error retrieving Purchase Request Detail with id=" + mas_id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Br_pr_det = db1.br_pr_det;

  const id = req.params.id;
  Br_pr_det.update(req.body, {
    where: { br_pr_mid: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Purchase Request Detail was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Purchase Request Detail with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Br_pr_det = db1.br_pr_det;

  const id = req.params.id;
  Br_pr_det.destroy({
    where: { br_pr_did: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Purchase Request Detail was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Purchase Request Detail with id=${id}`,
      });
    }
  });
};


