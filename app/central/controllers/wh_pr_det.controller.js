const db = require("../models/user");
const Wh_pr_det = db.wh_pr_det;

exports.create = async (req, res) => {
  if (!req.body.wh_pr_mid) {
    res.status(400).send({
      message: "Request Master id can not be empty !",
    });
    return;
  }

  const wh_pr_det = {
    wh_pr_mid: req.body.wh_pr_mid,
    material_id: req.body.material_id,
    quantity: req.body.quantity,
    dept_id: req.body.dept_id,
    status:'0',
  };
  
  Wh_pr_det.findAll({
    where:{
       wh_pr_mid: req.body.wh_pr_mid,
       material_id: req.body.material_id
    }
  })
    .then((data) => {
      if(!data.length)
      {
        Wh_pr_det.create(wh_pr_det)
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
          message: "Material Already Exist with this Purchase Request Master id"+req.body.wh_pr_mid,
         });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving Purchase Request Detail",
      });
    });
};

exports.findAll = (req, res) => {
    Wh_pr_det.findAll()
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

exports.findOne = (req, res) => {
  const id = req.params.id;
  Wh_pr_det.findByPk(id)
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
  const mas_id = req.params.mas_id;
  Wh_pr_det.findAll({
    where: {wh_pr_mid:mas_id},
    
      include: [
        {
          model: db.raw_material,
          as: 'pr_mat'
    
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
  const id = req.params.id;

  Wh_pr_det.update(req.body, {
    where: { wh_pr_mid: id },
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
  const id = req.params.id;

  Wh_pr_det.destroy({
    where: { wh_pr_did: id },
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


