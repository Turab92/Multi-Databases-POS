const db = require("../models/user");
const Role = db.role;
const Sequelize = require('sequelize');
const Op = Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Role name can not be empty !",
    });
    return;
  }

  const role = {
    name: req.body.name,
    for_retailer: req.body.for_retailer,
  };
  Role.findAll({
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('name')), 
      Sequelize.fn('lower', req.body.name)
    )
  })
    .then((data) => {
      if(!data.length)
        {
          Role.create(role)
          .then((data) => {
           res.status(200).send(data);
          })
          .catch((err) => {
            res.status(500).send({
              message: err.message || "Some error occurred while create the Role",
            });
          }); 
        }
        else
        {
          res.status(400).send({
            message: "Data Already Exist",
           });
        }
     
    })
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving Product",
      });
    });
};

exports.findAll = (req, res) => {
    Role.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Role",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findAllRetailer = (req, res) => {
  Role.findAll({
    where: 
    {
      for_retailer:1
    }
  })//findAll return array
  .then((data) => {
      if(!data.length)
      {
         res.status(500).send({
                 message: "Some error occured while retrieving Role",
            });
      }
      else
      {
         res.status(200).send(data);
      }
  })
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Role.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Role with id=" + id,
           });
     }
     else
     {
        res.status(200).send(data);
     }
     
    })
};

exports.update = (req, res) => {
  const id = req.params.id;
    //update() returns an array with two possible objects. The first is the number of rows affected by the update.It's always included. The second element is an array of the data instances from the rows themselves.
    if (!req.body.name) {
      res.status(400).send({
        message: "Role name can not be empty !",
      });
      return;
    }

    Role.update(req.body, {
      where: { role_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Role was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Role with id=${id}`,
        });
      }
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Role.destroy({
    where: { role_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Role was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Role with id=${id}`,
      });
    }
  });
};


