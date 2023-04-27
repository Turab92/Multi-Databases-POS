const db = require("../../central/models/user");

exports.create = (req, res) => {
  const db1=req.ret_db
  const Pay_types = db1.pay_type;

  if (!req.body.p_type_name) {
    res.status(400).send({
      message: "Payment Type name can not be empty !",
    });
    return;
  }

  const pay_type = {
    p_type_name: req.body.p_type_name,
    status:'1',
  };

  Pay_types.create(pay_type)
    .then((data) => {
     res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while create the Payment Type",
      });
    });
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Pay_types = db1.pay_type;

    Pay_types.findAll()
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
        message: err.message || "Some error occured while retrieving Payment Type",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Pay_types = db1.pay_type;

  const id = req.params.id;
  Pay_types.findByPk(id)
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
        message: "Error retrieving Payment Type with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Pay_types = db1.pay_type;

  const id = req.params.id;

  Pay_types.update(req.body, {
    where: { p_type_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      res.status(200).send({
        message: "Payment Type was updated successfully",
      });
    } else {
      res.status(500).send({
        message: `Cannot update Payment Type with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Pay_types = db1.pay_type;

  const id = req.params.id;
  Pay_types.destroy({
    where: { p_type_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Payment Type was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Payment Type with id=${id}`,
      });
    }
  });
};


