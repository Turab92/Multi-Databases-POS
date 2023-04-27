const db = require("../../central/models/user");
const Retailer = db.retailer;
const sequelize = require('sequelize');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createProd': {
     return [ 
        body('pro_name', 'Product Name is required').notEmpty(),
       ]   
    }
    case 'updateProd': {
      return [ 
         body('pro_name', 'Product Name is required').notEmpty(),
         body('status', 'status is required').notEmpty(),
         body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}
exports.create = (req, res) => {
  const db1=req.ret_db
  const Products = db1.products;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
            
      if (!req.body.pro_name) {
        res.status(400).send({
          message: "Product name can not be empty !",
        });
        return;
      }
    
      else{
        if(req.file == undefined){
        
          var path = null;
        }
        else
        {
          var path = req.protocol+ '://' + req.get('Host') + '/public/product_image/' + req.file.filename;
        }
          
        
          const product = {
            pro_name: req.body.pro_name,
            pro_image:path,
            status:"1",
          };
          Products.findAll({
            where: sequelize.where(
              sequelize.fn('lower', sequelize.col('pro_name')), 
              sequelize.fn('lower', req.body.pro_name)
            )
          })
            .then((data) => {
              if(!data.length)
                {
                  Products.create(product)
                  .then(data => {
                    res.status(200).send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message || "Some error occurred while create the Product",
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
            }
  }

};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Products = db1.products;

  Products.findAll({
    where:{status:1},
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
        message: err.message || "Some error occured while retrieving Product",
      });
    });
};

exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Products = db1.products;

  Products.findAll()
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
        message: err.message || "Some error occured while retrieving Product",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Products = db1.products;

  const id = req.params.id;
  Products.findByPk(id)
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
        message: "Error retrieving Product with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Products = db1.products;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {           
      if (req.file == undefined) {
      
        Products.update(req.body, {
          where: { product_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Product was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Product with id=${id}`,
            });
          }
        });
      }
    
      else{
        
          var path = req.protocol+ '://' + req.get('Host') + '/public/product_image/' + req.file.filename;
        
          
        
          const product = {
            pro_name: req.body.pro_name,
            pro_image:path,
            status:req.body.status,
          };
        
            Products.update(product, {
              where: { product_id: id },
            }).then((data) => {
              if (data[0] != 0) {
                res.status(200).send({
                  message: "Product was updated successfully",
                });
              } else {
                res.status(500).send({
                  message: `Cannot update Product with id=${id}`,
                });
              }
            });
          }
           
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Products = db1.products;

  const id = req.params.id;
  Products.destroy({
    where: { product_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Product was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Product with id=${id}`,
      });
    }
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
  const Products = db1.products;

  Products.findAll()
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
        message: err.message || "Some error occured while retrieving Product",
      });
    });
};


