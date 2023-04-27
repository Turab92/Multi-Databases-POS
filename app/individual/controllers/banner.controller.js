const db = require("../../central/models/user");
const Retailer = db.retailer;
const sizeOf = require('image-size')
const fs = require('fs');
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createBanner': {
     return [
    
        body('dept_id', 'Department value must be in integer').isInt(),
        body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
        body('priority', 'Priority value must be in integer').isInt(),
       ]   
    }
    case 'updateBanner': {
      return [ 
          body('dept_id', 'Department value must be in integer').isInt(),
          body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
          body('priority', 'Priority value must be in integer').isInt(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create = (req, res) => {
  const db1=req.ret_db
  const Banner = db1.banner;
  var error =[];
   // Finds the validation errors in this request and wraps them in an object with handy functions
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
     res.status(422).json({ errors: errors.array() });
     return;
   }
   else
   {        
          if (Object.keys(req.files).length  === 0) {
            res.status(400).send({
              message: "Web or App image can not be empty !",
            });
            return;
          }
          
          else{
              var path;
              var path2; 
              var web_dimensions;
              var app_dimensions;
              if (req.files.web_banner == undefined) {
                  path ='';
              }
              else
              {
                  path = req.protocol+ '://' + req.get('Host') + '/public/Banner/' + req.files.web_banner[0].filename;
                  if(req.files.web_banner[0].mimetype != 'image/jpeg' && req.files.web_banner[0].mimetype != 'image/jpg' && req.files.web_banner[0].mimetype != 'image/png')
                  {
                      error.push( "Web image type must be jpg, png, jpeg!");  
                  }
                  else
                  {
                    web_dimensions = sizeOf('public/Banner/' + req.files.web_banner[0].filename)
                    if(web_dimensions.width != 1520 && web_dimensions.height != 460)
                    {      
                      error.push("Web image size must be 1520x460 !");
                    }
                  }
            }

              if (req.files.app_banner == undefined) {
                  path2 ='';
              }
              else{
                  path2 = req.protocol+ '://' + req.get('Host') + '/public/Banner/' + req.files.app_banner[0].filename;
                  
                   if(req.files.app_banner[0].mimetype != 'image/jpeg' && req.files.app_banner[0].mimetype != 'image/jpg' && req.files.app_banner[0].mimetype != 'image/png')
                   {
                      error.push("App image type must be jpg, png, jpeg!");
                   }
                   else
                   {
                      app_dimensions = sizeOf('public/Banner/' + req.files.app_banner[0].filename)
                      if(app_dimensions.width != 800 && app_dimensions.height != 362)
                      {
                        error.push("App image size must be 800x362 !");
                      }
                   }
              }
              if(error.length!=0){
                if (req.files.web_banner != undefined) {
                  fs.unlinkSync('public/Banner/' + req.files.web_banner[0].filename)
                }
                if (req.files.app_banner != undefined) {
                  fs.unlinkSync('public/Banner/' + req.files.app_banner[0].filename)
                }
                
                res.status(203).send(error);
              }
              else{
                  const banner = {
                    dept_id: req.body.dept_id,
                    sub_pro_id: req.body.sub_pro_id,
                    priority: req.body.priority,
                    banner_validity: req.body.banner_validity,
                    start_time: req.body.start_time,
                    end_time: req.body.end_time,
                    web_banner_image: path,
                    app_banner_image: path2,
                    status:'1',
                  };
                  Banner.create(banner)
                  .then((data) => {
                  res.status(200).send(data);
                  })
                  .catch((err) => {
                    res.status(500).send({
                      message: err.message || "Some error occurred while create the Banner",
                    });
                  });
              }
              
            }
 
    }
  
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Banner = db1.banner;
    Banner.findAll({
      include: [
          {
            model: db1.sub_products,
            as: 'banner_sub'
          },
          {
            model: db.department_setup,
            as: 'banner_dept'
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
        message: err.message || "Some error occured while retrieving Banner",
      });
    });
};

exports.findDeptAll = (req, res) => {
  const db1=req.ret_db
  const Banner = db1.banner;

  const deptid = req.params.deptid;
  Banner.findAll({
    where:{dept_id:deptid,status:1},
    include: [
        {
          model: db1.sub_products,
          as: 'banner_sub'
        },
        {
          model: db.department_setup,
          as: 'banner_dept'
        }
      ]
  })
  .then((data) => {
    if(!data.length)
      {
        Banner.findAll({
          where:{dept_id:0,status:1},
          include: [
              {
                model: db1.sub_products,
                as: 'banner_sub'
              },
              {
                model: db.department_setup,
                as: 'banner_dept'
              }
            ]
        })
        .then((data2) => {
          if(!data2.length)
          {
            res.status(500).send({
              message: "Data Not Found",
            });
          }
          else
          {
            res.status(200).send(data2);
          }
        })
        .catch((err) => {
          res.status(502).send({
            message: err.message || "Some error occured while retrieving Banner",
          });
        });
      }
      else
      {
         res.status(200).send(data);
      }
  })
  .catch((err) => {
    res.status(502).send({
      message: err.message || "Some error occured while retrieving Banner",
    });
  });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Banner = db1.banner;

  const id = req.params.id;
  Banner.findByPk(id,{
    include: [
        {
          model: db1.sub_products,
          as: 'banner_sub'
        },
        {
          model: db.department_setup,
          as: 'banner_dept'
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
        message: "Error retrieving Banner with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Banner = db1.banner;

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
      
        Banner.update(req.body, {
          where: { banner_id: id },
        }).then((data) => {
          if (data[0] != 0) {
            res.status(200).send({
              message: "Banner was updated successfully",
            });
          } else {
            res.status(500).send({
              message: `Cannot update Banner with id=${id}`,
            });
          }
        });
      }
      else
      {
        var path;
        var path2; 
        var web_dimensions;
        var app_dimensions;
        if (req.files.web_banner == undefined && req.files.app_banner != undefined) {

            path2 = req.protocol+ '://' + req.get('Host') + '/public/Banner/' + req.files.app_banner[0].filename;
            if(req.files.app_banner[0].mimetype != 'image/jpeg' && req.files.app_banner[0].mimetype != 'image/jpg' && req.files.app_banner[0].mimetype != 'image/png')
            {
              error.push("App image type must be jpg, png, jpeg!");
            }
            else
            {
              app_dimensions = sizeOf('public/Banner/' + req.files.app_banner[0].filename)
              if(app_dimensions.width != 800 && app_dimensions.height != 362)
              {
                error.push("App image size must be 800x362 !");
              }
            }
            if(error.length!=0){
                fs.unlinkSync('public/Banner/' + req.files.app_banner[0].filename)
                res.status(203).send(error);
            }
            else{
                const banner = {
                  dept_id: req.body.dept_id,
                  sub_pro_id: req.body.sub_pro_id,
                  priority: req.body.priority,
                  banner_validity: req.body.banner_validity,
                  start_time: req.body.start_time,
                  end_time: req.body.end_time,
                  app_banner_image: path2,
                  status:req.body.status,
                };
                Banner.update(banner, {
                  where: { banner_id: id },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Banner was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Banner with id=${id}`,
                    });
                  }
                });    
            }
        }
        else if(req.files.web_banner != undefined && req.files.app_banner == undefined)
        {
            path = req.protocol+ '://' + req.get('Host') + '/public/Banner/' + req.files.web_banner[0].filename;
            if(req.files.web_banner[0].mimetype != 'image/jpeg' && req.files.web_banner[0].mimetype != 'image/jpg' && req.files.web_banner[0].mimetype != 'image/png')
            {
                error.push( "Web image type must be jpg, png, jpeg!");  
            }
            else
            {
              web_dimensions = sizeOf('public/Banner/' + req.files.web_banner[0].filename)
              if(web_dimensions.width != 1520 && web_dimensions.height != 460)
              {      
                error.push("Web image size must be 1520x460 !");
              }
            }
            if(error.length!=0){
              fs.unlinkSync('public/Banner/' + req.files.web_banner[0].filename)
              res.status(203).send(error);
          }
          else
          {
              const banner = {
                dept_id: req.body.dept_id,
                sub_pro_id: req.body.sub_pro_id,
                priority: req.body.priority,
                banner_validity: req.body.banner_validity,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                web_banner_image: path,
                status:req.body.status,
              };
              Banner.update(banner, {
                where: { banner_id: id },
              }).then((data) => {
                if (data[0] != 0) {
                  res.status(200).send({
                    message: "Banner was updated successfully",
                  });
                } else {
                  res.status(500).send({
                    message: `Cannot update Banner with id=${id}`,
                  });
                }
              });    
          }
        }
        else
        {
            path = req.protocol+ '://' + req.get('Host') + '/public/Banner/' + req.files.web_banner[0].filename;
            if(req.files.web_banner[0].mimetype != 'image/jpeg' && req.files.web_banner[0].mimetype != 'image/jpg' && req.files.web_banner[0].mimetype != 'image/png')
            {
                error.push( "Web image type must be jpg, png, jpeg!");  
            }
            else
            {
              web_dimensions = sizeOf('public/Banner/' + req.files.web_banner[0].filename)
              if(web_dimensions.width != 1520 && web_dimensions.height != 460)
              {      
                error.push("Web image size must be 1520x460 !");
              }
            }

            path2 = req.protocol+ '://' + req.get('Host') + '/public/Banner/' + req.files.app_banner[0].filename;
            if(req.files.app_banner[0].mimetype != 'image/jpeg' && req.files.app_banner[0].mimetype != 'image/jpg' && req.files.app_banner[0].mimetype != 'image/png')
            {
              error.push("App image type must be jpg, png, jpeg!");
            }
            else
            {
              app_dimensions = sizeOf('public/Banner/' + req.files.app_banner[0].filename)
              if(app_dimensions.width != 800 && app_dimensions.height != 362)
              {
                error.push("App image size must be 800x362 !");
              }
            }
            if(error.length!=0){
                fs.unlinkSync('public/Banner/' + req.files.web_banner[0].filename)
                fs.unlinkSync('public/Banner/' + req.files.app_banner[0].filename)
                res.status(203).send(error);
            }
            else
            {
                const banner = {
                  dept_id: req.body.dept_id,
                  sub_pro_id: req.body.sub_pro_id,
                  priority: req.body.priority,
                  banner_validity: req.body.banner_validity,
                  start_time: req.body.start_time,
                  end_time: req.body.end_time,
                  web_banner_image: path,
                  app_banner_image: path2,
                  status:req.body.status,
              };
                Banner.update(banner, {
                  where: { banner_id: id },
                }).then((data) => {
                  if (data[0] != 0) {
                    res.status(200).send({
                      message: "Banner was updated successfully",
                    });
                  } else {
                    res.status(500).send({
                      message: `Cannot update Banner with id=${id}`,
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
  const Banner = db1.banner;

  const id = req.params.id;
  Banner.destroy({
    where: { banner_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Banner was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Banner with id=${id}`,
      });
    }
  });
};

exports.Retailer_banner = async (req, res) => {
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
  const Banner = db1.banner;
    Banner.findAll({
      include: [
          {
            model: db1.sub_products,
            as: 'banner_sub'
          },
          {
            model: db.department_setup,
            as: 'banner_dept'
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
        message: err.message || "Some error occured while retrieving Banner",
      });
    });
};
