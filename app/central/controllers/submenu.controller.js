const db = require("../models/user");
const Submenu = db.submenu;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createSubmenu': {
     return [ 
        body('main_id', 'Mainmenu is required').notEmpty(),
        body('main_id', 'Mainmenu value must be in integer').isInt(),
        body('sub_title', 'Submenu title is required').notEmpty(),
        body('sub_link', 'Submenu link is required').notEmpty(),
        body('sub_seq', 'Submenu sequence is required').notEmpty(),
        body('sub_seq', 'Submenu sequence value must be in integer').isInt(),
       ]   
    }
    case 'updateSubmenu': {
      return [ 
         body('main_id', 'Mainmenu is required').notEmpty(),
         body('main_id', 'Mainmenu value must be in integer').isInt(),
         body('sub_title', 'Submenu title is required').notEmpty(),
         body('sub_link', 'Submenu link is required').notEmpty(),
         body('sub_seq', 'Submenu sequence is required').notEmpty(),
         body('sub_seq', 'Submenu sequence value must be in integer').isInt(),
         body('status', 'Status is required').notEmpty(),
         body('status', 'Status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      const submenu = {
        main_id: req.body.main_id,
        sub_title: req.body.sub_title,
        sub_link: req.body.sub_link,
        sub_seq: req.body.sub_seq,
        status: 1,
      };

      Submenu.create(submenu)
        .then((data) => {
        res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while create the Submenu",
          });
        });
  }
};

exports.findAll = (req, res) => {
    Submenu.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Submenu",
              });
        }
        else
        {
           res.status(200).send(data);
        }
    })
};

exports.findMain = (req, res) => {
  const mainid = req.params.id;
  Submenu.findAll({
    where:{main_id:mainid},
    attributes: [['sub_id', 'value'], ['sub_title', 'label']],
  })//findAll return array
  .then((data) => {
      if(!data.length)
      {
         res.status(500).send({
                 message: "Some error occured while retrieving Submenu",
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
  Submenu.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Submenu with id=" + id,
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
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    else
    { 
      Submenu.update(req.body, {
        where: { sub_id: id },
      }).then((data) => {
        if (data[0] != 0) {
          res.status(200).send({
            message: "Submenu was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update Submenu with id=${id}`,
          });
        }
      });
    }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Submenu.destroy({
    where: { sub_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Submenu was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Submenu with id=${id}`,
      });
    }
  });
};


