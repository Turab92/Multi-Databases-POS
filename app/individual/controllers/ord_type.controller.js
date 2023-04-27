const db = require("../../central/models/user");

exports.create = (req, res) => {
  const db1=req.ret_db
  const Order_types = db1.order_type;

  if (!req.body.o_type_name) {
    res.status(400).send({
      message: "Order Type name can not be empty !",
    });
    return;
  }

  const ord_type = {
    o_type_name: req.body.o_type_name,
    status:'1',
  };

  Order_types.create(ord_type)
    .then((data) => {
     res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while create the Order Type",
      });
    });
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Order_types = db1.order_type;

  Order_types.findAll()
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
        message: err.message || "Some error occured while retrieving Order Type",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Order_types = db1.order_type;

  const id = req.params.id;
  Order_types.findByPk(id)
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
        message: "Error retrieving Order Type with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Order_types = db1.order_type;

  const id = req.params.id;

  Order_types.update(req.body, {
    where: { o_type_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Order Type was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Order Type with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Order_types = db1.order_type;

  const id = req.params.id;
  Order_types.destroy({
    where: { o_type_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Order Type was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Order Type with id=${id}`,
      });
    }
  });
};


