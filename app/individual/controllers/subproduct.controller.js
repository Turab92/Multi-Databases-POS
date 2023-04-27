const db = require("../../central/models/user");
const Retailer =db.retailer
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createSubproduct': {
     return [ 
        body('product_id', 'Product is required').notEmpty(),
        body('product_id', 'Product value must be in integer').isInt(),
        body('sub_pro_name', 'Subproduct name is required').notEmpty(),
       ]   
    }
    case 'updateSubproduct': {
      return [ 
          body('product_id', 'Product is required').notEmpty(),
          body('product_id', 'Product value must be in integer').isInt(),
          body('sub_pro_name', 'Subproduct name is required').notEmpty(),
          body('status', 'Status is required').notEmpty(),
          body('status', 'Status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  var error =[];
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
        if (Object.keys(req.files).length  === 0) {
              res.status(400).send({
                message: "Images can not be empty !",
              });
              return;
            }
            
        else{
          var path;
          var path2;
          if (req.files.sub_pro_image == undefined || req.files.sub_pro_app_image == undefined) 
          {
              res.status(400).send({
                message: "Sub Product both images can not be empty !",
              });
              return;
          }
        else
        {
          if((req.files.sub_pro_image[0].mimetype != 'image/jpeg' && req.files.sub_pro_image[0].mimetype != 'image/jpg' && req.files.sub_pro_image[0].mimetype != 'image/png') || (req.files.sub_pro_app_image[0].mimetype != 'image/jpeg' && req.files.sub_pro_app_image[0].mimetype != 'image/jpg' && req.files.sub_pro_app_image[0].mimetype != 'image/png'))
          {
              error.push( "Both images type must be jpg, png, jpeg!");  
          }
          else
          {
            path = req.protocol+ '://' + req.get('Host') + '/public/sub_pro_image/' + req.files.sub_pro_image[0].filename;
            path2 = req.protocol+ '://' + req.get('Host') + '/public/sub_pro_image/' + req.files.sub_pro_app_image[0].filename;
         
            
              const sub_product = {
                sub_pro_name: req.body.sub_pro_name,
                product_id: req.body.product_id,
                sub_pro_image: path,
                sub_pro_app_image:path2,
                sub_pro_desc: req.body.sub_pro_desc,
                sub_pro_price: req.body.sub_pro_price,
                status:'1',
              };
              Sub_products.findAll({
                where: Sequelize.where(
                  Sequelize.fn('lower', Sequelize.col('sub_pro_name')), 
                  Sequelize.fn('lower', req.body.sub_pro_name)
                )
              })
                .then((data) => {
                  if(!data.length)
                    {
                      if(error.length!=0){
                        if (req.files.sub_pro_image != undefined) {
                          fs.unlinkSync('public/sub_pro_image/' + req.files.sub_pro_image[0].filename)
                        }
                        if (req.files.sub_pro_app_image != undefined) {
                          fs.unlinkSync('public/sub_pro_image/' + req.files.sub_pro_app_image[0].filename)
                        }
                        
                        res.status(203).send(error);
                      }
                      else
                      {
                        Sub_products.create(sub_product)
                        .then((data) => {
                        res.status(200).send(data);
                        })
                        .catch((err) => {
                          res.status(500).send({
                            message: err.message || "Some error occurred while create the Sub Product",
                          });
                        });
                      }
                       
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
          }
         
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  Sub_products.findAll({
    where:{status:1},
    include: [
        {
          model: db1.products,
          as: 'products'
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
        message: err.message || "Some error occured while retrieving Sub Product",
      });
    });
};


exports.findAllData = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  Sub_products.findAll({
    include: [
        {
          model: db1.products,
          as: 'products'
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
        message: err.message || "Some error occured while retrieving Sub Product",
      });
    });
};

exports.findRetailerData = async (req, res) => {
  var retailer = await Retailer.findByPk(req.params.retailer_id)
  if(!retailer)
    {
       res.status(500).send({
               message: "Sorry! Data Not Found With Id=" + req.params.retailer_id,
          });
    }
    else
    {
      const ret_db = require("../../individual/models/user");
      req.cur_ret_db=ret_db.getdb(retailer.dataValues.retailer_unique_no)
    }
  const db1=req.cur_ret_db
  const Sub_products = db1.sub_products;

  Sub_products.findAll({
    include: [
        {
          model: db1.products,
          as: 'products'
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
        message: err.message || "Some error occured while retrieving Sub Product",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  const id = req.params.id;
  Sub_products.findByPk(id,{
    include: [
        {
          model: db1.products,
          as: 'products'
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
        message: "Error retrieving Sub Product with id=" + id,
      });
    });
};

exports.findPro = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  const id = req.params.id;
  Sub_products.findAll({
    where: { product_id: id, status:1 },
    include: [
      {
        model: db1.subpro_rate_setup,
        as: 'subpro_rate',
        where: { status:1 }
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
        message: "Error retrieving Sub Product with Product id=" + id,
      });
    });
};

exports.findPro2 = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  const id = req.params.id;
  Sub_products.findAll({
    where: { product_id: id, status:1 },
    attributes: [['sub_pro_id', 'value'], ['sub_pro_name', 'label']],
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
        message: "Error retrieving Sub Product with Product id=" + id,
      });
    });
};

exports.findSub = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  const name= req.params.name;
  Sub_products.findAll({
    where: { 
      sub_pro_name: {
        [Op.iLike]: `%${name}%`
      }, 
      status:1,
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
        message: "Error retrieving Sub Product",
      });
    });
};


exports.update = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  var error =[];
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
            
      if (Object.keys(req.files).length  === 0) {
      
        Sub_products.update(req.body, {
          where: { sub_pro_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Sub Product was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Sub Product with id=${id}`,
            });
          }
        });
      }
    
      else
      {
        var path;
        var path2; 
        if (req.files.sub_pro_image == undefined && req.files.sub_pro_app_image != undefined) 
        {
          if(req.files.sub_pro_app_image[0].mimetype != 'image/jpeg' && req.files.sub_pro_app_image[0].mimetype != 'image/jpg' && req.files.sub_pro_app_image[0].mimetype != 'image/png')
          {
              error.push( "Image type must be jpg, png, jpeg!");  
          }
          else
          {
            path2 = req.protocol+ '://' + req.get('Host') + '/public/sub_pro_image/' + req.files.sub_pro_app_image[0].filename;
          }
          if(error.length!=0)
          {
            fs.unlinkSync('public/sub_pro_image/' + req.files.sub_pro_app_image[0].filename)
            res.status(203).send(error);
          }
          else
          {
            const sub_product = {
              sub_pro_name: req.body.sub_pro_name,
              product_id: req.body.product_id,
              sub_pro_app_image: path2,
              sub_pro_desc: req.body.sub_pro_desc,
              sub_pro_price: req.body.sub_pro_price,
              status:req.body.status,
            };
          
            Sub_products.update(sub_product, {
              where: { sub_pro_id: id },
            }).then((data) => {
              if (data[0] != 0) {
                res.status(200).send({
                  message: "Sub Product was updated successfully",
                });
              } else {
                res.status(500).send({
                  message: `Cannot update Sub Product with id=${id}`,
                });
              }
            });
          }
        } 
        else if (req.files.sub_pro_image != undefined && req.files.sub_pro_app_image == undefined) 
        {
          if(req.files.sub_pro_image[0].mimetype != 'image/jpeg' && req.files.sub_pro_image[0].mimetype != 'image/jpg' && req.files.sub_pro_image[0].mimetype != 'image/png')
          {
              error.push( "Image type must be jpg, png, jpeg!");  
          }
          else
          {
            path = req.protocol+ '://' + req.get('Host') + '/public/sub_pro_image/' + req.files.sub_pro_image[0].filename;
          }
          if(error.length!=0)
          {
            fs.unlinkSync('public/sub_pro_image/' + req.files.sub_pro_image[0].filename)
            res.status(203).send(error);
          }
          else
          {
            const sub_product = {
              sub_pro_name: req.body.sub_pro_name,
              product_id: req.body.product_id,
              sub_pro_image: path,
              sub_pro_desc: req.body.sub_pro_desc,
              sub_pro_price: req.body.sub_pro_price,
              status:req.body.status,
            };
          
            Sub_products.update(sub_product, {
              where: { sub_pro_id: id },
            }).then((data) => {
              if (data[0] != 0) {
                res.status(200).send({
                  message: "Sub Product was updated successfully",
                });
              } else {
                res.status(500).send({
                  message: `Cannot update Sub Product with id=${id}`,
                });
              }
            });
          }
        }
        else
        {
            if((req.files.sub_pro_image[0].mimetype != 'image/jpeg' && req.files.sub_pro_image[0].mimetype != 'image/jpg' && req.files.sub_pro_image[0].mimetype != 'image/png') || (req.files.sub_pro_app_image[0].mimetype != 'image/jpeg' && req.files.sub_pro_app_image[0].mimetype != 'image/jpg' && req.files.sub_pro_app_image[0].mimetype != 'image/png'))
            {
                error.push( "Both images type must be jpg, png, jpeg!");  
            }
            else
            {
              path = req.protocol+ '://' + req.get('Host') + '/public/sub_pro_image/' + req.files.sub_pro_image[0].filename;
              path2 = req.protocol+ '://' + req.get('Host') + '/public/sub_pro_image/' + req.files.sub_pro_app_image[0].filename;
            }
            if(error.length!=0){
              if (req.files.sub_pro_image != undefined) {
                fs.unlinkSync('public/sub_pro_image/' + req.files.sub_pro_image[0].filename)
              }
              if (req.files.sub_pro_app_image != undefined) {
                fs.unlinkSync('public/sub_pro_image/' + req.files.sub_pro_app_image[0].filename)
              }
              
              res.status(203).send(error);
            }
            else
            {
              const sub_product = {
                sub_pro_name: req.body.sub_pro_name,
                product_id: req.body.product_id,
                sub_pro_image: path,
                sub_pro_app_image:path2,
                sub_pro_desc: req.body.sub_pro_desc,
                sub_pro_price: req.body.sub_pro_price,
                status:req.body.status,
              };
              Sub_products.update(sub_product, {
                where: { sub_pro_id: id },
              }).then((data) => {
                if (data[0] != 0) {
                  res.status(200).send({
                    message: "Sub Product was updated successfully",
                  });
                } else {
                  res.status(500).send({
                    message: `Cannot update Sub Product with id=${id}`,
                  });
                }
              });
            }
        }
      }
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  const id = req.params.id;
  Sub_products.destroy({
    where: { sub_pro_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Sub Product was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Sub Product with id=${id}`,
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
  const Sub_products = db1.sub_products;

  Sub_products.findAll({
    include: [
        {
          model: db1.products,
          as: 'products'
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
        message: err.message || "Some error occured while retrieving Sub Product",
      });
    });
};

exports.subpro_receipe = (req, res) => {
  const db1=req.ret_db
  const Sub_products = db1.sub_products;

  Sub_products.findAll({
    where:{status:1},
    include: [
        {
          model: db1.product_cost,
          as: 'subpro',
          where:{status:1}
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
        message: err.message || "Some error occured while retrieving Sub Product",
      });
    });
};