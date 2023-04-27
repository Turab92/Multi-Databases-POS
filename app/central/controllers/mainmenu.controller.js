const db = require("../models/user");
const Mainmenu = db.mainmenu;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createMain': {
     return [ 
        body('main_title', 'MainMenu Name is required').notEmpty(),
        body('main_seq', 'Menu sequence is required').notEmpty(),
       ]   
    }
    case 'updateMain': {
      return [ 
         body('main_title', 'MainMenu Name is required').notEmpty(),
         body('main_seq', 'Menu sequence is required').notEmpty(),
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

      const mainmenu = {
        main_title: req.body.main_title,
        main_link: req.body.main_link,
        main_seq: req.body.main_seq,
        status: 1,
      };

      Mainmenu.create(mainmenu)
        .then((data) => {
        res.status(200).send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message || "Some error occurred while create the Mainmenu",
          });
        });
  }
};

exports.findAll = (req, res) => {
    Mainmenu.findAll()//findAll return array
    .then((data) => {
        if(!data.length)
        {
           res.status(500).send({
                   message: "Some error occured while retrieving Mainmenu",
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
  Mainmenu.findByPk(id)//fineone or findByPK return object
    .then((data) => {
     if(!data)
     {
        res.status(500).send({
                message: "Error retrieving Mainmenu with id=" + id,
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
      Mainmenu.update(req.body, {
        where: { main_id: id },
      }).then((data) => {
        if (data[0] != 0) {
          res.status(200).send({
            message: "Mainmenu was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update Mainmenu with id=${id}`,
          });
        }
      });
    }
};

exports.delete = (req, res) => {
  const id = req.params.id;
  //Destroy all instances that match a query. It returns a promise for the number of rows that were deleted.
  Mainmenu.destroy({
    where: { main_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Mainmenu was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Mainmenu with id=${id}`,
      });
    }
  });
};


