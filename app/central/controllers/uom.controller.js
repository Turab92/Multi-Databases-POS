const db = require("../models/user");
const UOM = db.uom;


exports.create = (req, res) => {
  if (!req.body.uom_name) {
    res.status(400).send({
      message: "UOM name can not be empty !",
    });
    return;
  }

  const uom = {
    uom_name: req.body.uom_name,
    status:'1',
  };

  UOM.create(uom)
    .then((data) => {
     res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while create the UOM",
      });
    });
};

exports.findAll = (req, res) => {
  
    UOM.findAll()
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
        message: err.message || "Some error occured while retrieving UOM",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  UOM.findByPk(id)
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
        message: "Error retrieving UOM with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  if (!req.body.uom_name) {
    res.status(400).send({
      message: "UOM name can not be empty !",
    });
    return;
  }
  UOM.update(req.body, {
    where: { uom_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "UOM was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update UOM with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  UOM.destroy({
    where: { uom_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "UOM was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete UOM with id=${id}`,
      });
    }
  });
};


