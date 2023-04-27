const db = require("../models/user");
const Comp_detail = db.comp_detail;
const { body, validationResult } = require("express-validator");

exports.validate = (method) => {
  switch (method) {
    case "createCompDet": {
      return [
          body("comp_email", "Email is not valid").isEmail()];
    }
    case "updateCompDet": {
      return [
        body("comp_email", "Email is required").notEmpty(),
        body("status", "status is required").notEmpty(),
        body("status", "status value must be in integer").isInt(),
      ];
    }
  }
};

exports.create = async (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  } else {
    if (Object.keys(req.files).length === 0) {
      res.status(400).send({
        message: "Images can not be empty !",
      });
      return;
    } else {
      var logo_path;
      var fav_path;
      if (req.files.comp_logo == undefined || req.files.comp_favicon == undefined) {
        res.status(400).send({
          message: "Sub Product both images can not be empty !",
        });
        return;
      } else {
        if ((req.files.comp_logo[0].mimetype != "image/jpeg" &&
            req.files.comp_logo[0].mimetype != "image/jpg" &&
            req.files.comp_logo[0].mimetype != "image/png") ||
          (req.files.comp_favicon[0].mimetype != "image/jpeg" &&
            req.files.comp_favicon[0].mimetype != "image/jpg" &&
            req.files.comp_favicon[0].mimetype != "image/png")
        ) {
          error.push("Both images type must be jpg, png, jpeg!");
        } else {
          logo_path = req.protocol + "://" + req.get("Host") + "/public/company_images/" + req.files.comp_logo[0].filename;
          fav_path = req.protocol + "://" + req.get("Host") + "/public/company_images/" + req.files.comp_favicon[0].filename;

          const comp_detail = {
            comp_email: req.body.comp_email,
            comp_link: req.body.comp_link,
            comp_logo: logo_path,
            comp_favicon: fav_path,
            comp_description: req.body.comp_description,
            status: "1",
          };

          Comp_detail.create(comp_detail)
            .then((data) => {
              res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while create the Department",
              });
            });
        }
      }
    }
  }
};

exports.findAll = (req, res) => {
  Comp_detail.findAll({
      where:{status:1}
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
          err.message || "Some error occured while retrieving Department",
      });
    });
};

exports.findAllData = (req, res) => {
    Comp_detail.findAll()
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
            err.message || "Some error occured while retrieving Department",
        });
      });
  };
  

exports.findOne = (req, res) => {
  const id = req.params.id;
  Comp_detail.findByPk(id)
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
        message: "Error retrieving Department with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  } else {
    Comp_detail.update(req.body, {
      where: { comp_detail_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Department was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Department with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Comp_detail.destroy({
    where: { comp_detail_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Department was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Department with id=${id}`,
      });
    }
  });
};
