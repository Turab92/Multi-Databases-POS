const db = require("../../central/models/user");
const Retailer = db.retailer;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createRMC': {
     return [ 
          body('material_id', 'Material is required').notEmpty(),
          body('material_id', 'Material value must be in integer').isInt(),
          body('mat_cat_name', 'Material category name is required').notEmpty(),
          body('mat_cat_uom', 'Material category uom is required').notEmpty(),
          body('mat_cat_uom', 'Material category uom value must be in integer').isFloat(),
          body('mat_cat_rate', 'Material category rate is required').notEmpty(),
          body('mat_cat_rate', 'Material category rate value must be in integer').isFloat(),
       ]   
    }
    case 'updateRMC': {
      return [ 
          body('material_id', 'Material is required').notEmpty(),
          body('material_id', 'Material value must be in integer').isInt(),
          body('mat_cat_name', 'Material category name is required').notEmpty(),
          body('mat_cat_uom', 'Material category uom is required').notEmpty(),
          body('mat_cat_uom', 'Material category uom value must be in integer').isFloat(),
          body('mat_cat_rate', 'Material category rate is required').notEmpty(),
          body('mat_cat_rate', 'Material category rate value must be in integer').isFloat(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}
exports.create = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
              
    if (req.file == undefined) {
        res.status(400).send({
          message: "Category image can not be empty !",
        });
        return;
      }
      
        else{

            var bar;
            var time;
            if(req.body.radio_bar=='generate')
            {
              time=+new Date;
              bar=req.body.material_id.toString()+time.toString();
            }
            else
            {
              bar=req.body.mat_cat_barcode
            }
            Raw_mat_cat.findAll({
            where:{mat_cat_barcode:bar}
            })
            .then((data) => {
              if(data.length!=0)
              {
                res.status(203).send({
                  message:"Barcode already exist",
                });
              }
              else
              {

                  var path = req.protocol+ '://' + req.get('Host') + '/public/mat_cat_image/' + req.file.filename;
                
                  const raw_mat_cat = {
                    material_id: req.body.material_id,
                    mat_cat_name: req.body.mat_cat_name,
                    mat_cat_image: path,
                    mat_cat_uom: req.body.mat_cat_uom,
                    mat_cat_rate: req.body.mat_cat_rate,
                    mat_cat_barcode:bar,
                    mat_cat_disc: req.body.mat_cat_disc,
                    status:'1',
                  };
                  Raw_mat_cat.create(raw_mat_cat)
                  .then((data) => {
                  res.status(200).send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message || "Some error occurred while create the Material Category",
                    });
                  });
            }
          });
          }
     
  } 
};

exports.findAll = async (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;
  const Mat_rate_setup = db1.mat_rate_setup;

   var data = await Raw_mat_cat.findAll({
      include: [
          {
            model: db.raw_material,
            as: 'mat_cat'
          }
        ],
        raw: true,
        nest: true,
    }
    );
    const newData = [];
      if(!data.length)
        {
           res.status(500).send({
                   message: "Data Not Found.....................",
              });
        }
        else
        {
          for(var mat of data)
          {
            var i=0
            var data1 = await Mat_rate_setup.findAll({
              where:{ material_id:mat.material_id, status:1 },

            });
            newData.push({
                ...mat,
                mat_cat: {
                  ...mat.mat_cat,
                  mat: data1.length ? data1[0].dataValues : null
                }
            })
          }
          return  res.status(200).send(newData);
        }
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const id = req.params.id;
  Raw_mat_cat.findByPk(id,{
    include: [
      {
        model: db.raw_material,
        as: 'mat_cat'
      }
    ]
  })
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
        message: "Error retrieving Material Category with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {         
      if (req.file == undefined) {
      
        Raw_mat_cat.update(req.body, {
          where: { mat_cat_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Material Category was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Material Category with id=${id}`,
            });
          }
        });
      }
    
      else{
        
          var path = req.protocol+ '://' + req.get('Host') + '/public/mat_cat_image/' + req.file.filename;
      
          const raw_mat_cat = {
              material_id: req.body.material_id,
              mat_cat_name: req.body.mat_cat_name,
              mat_cat_image: path,
              mat_cat_uom: req.body.mat_cat_uom,
              mat_cat_rate: req.body.mat_cat_rate,
              mat_cat_barcode: req.body.mat_cat_barcode,
              mat_cat_disc: req.body.mat_cat_disc,
              status:req.body.status,
          };
        
          Raw_mat_cat.update(raw_mat_cat, {
            where: { mat_cat_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Material Category was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Material Category with id=${id}`,
              });
            }
          });
          }
        
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const id = req.params.id;

  Raw_mat_cat.destroy({
    where: { mat_cat_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Material Category was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Material Category with id=${id}`,
      });
    }
  });
};

exports.findMatCat = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const name= req.params.name;
  Raw_mat_cat.findAll({
    where: { 
      mat_cat_name: {
        [Op.iLike]: `%${name}%`
      } 
    },
    
  })
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
        message: "Error retrieving material ",
      });
    });
};

exports.findCat = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const id = req.params.id;
  Raw_mat_cat.findAll({
    where: { material_id: id },
    
  })
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
        message: "Error retrieving Category Material with Material id=" + id,
      });
    });
};

exports.findBarcode = (req, res) => {
  const db1=req.ret_db
  const Raw_mat_cat = db1.raw_mat_cat;

  const barcode = req.params.barcode;
  Raw_mat_cat.findAll({
    where: { mat_cat_barcode:barcode },
    
  })
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
        message: "Error retrieving Category Material with barcode=" + barcode,
      });
    });
};

exports.findAllDB = async (req, res) => {
  var retailer = await Retailer.findByPk(req.body.retailer_id)
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
  const Raw_mat_cat = db1.raw_mat_cat;
    Raw_mat_cat.findAll({
      include: [
          {
            model: db.raw_material,
            as: 'mat_cat',
            // include: [
            //   {
            //     model: db1.mat_rate_setup,
            //     as: 'mat',
            //     required: false,
            //     where: { status: 1 },
            //   }
            // ]
          }
        ]
    })
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
        message: err.message || "Some error occured while retrieving Material Category",
      });
    });
};