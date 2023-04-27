const db = require("../../central/models/user");
const Department_setup = db.department_setup;
const Retailer = db.retailer;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createBranchProd': {
     return [ 
          body('dept_id', 'Department is required').notEmpty(),
          body('dept_id', 'Department value must be in integer').isInt(),
          body('product_id', 'Product is required').notEmpty(),
          body('product_id', 'Product value must be in integer').isInt(),
          body('sub_pro_id', 'Sub Product is required').isArray({ min: 1}),
       ]   
    }
    case 'updateBranchProd': {
      return [ 
          body('dept_id', 'Department is required').notEmpty(),
          body('dept_id', 'Department value must be in integer').isInt(),
          body('product_id', 'Product is required').notEmpty(),
          body('product_id', 'Product value must be in integer').isInt(),
          body('sub_pro_id', 'Sub Product is required').notEmpty(),
          body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create =async (req, res) => {
  const db1=req.ret_db
  const Branch_product = db1.branch_product;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    // var data2 = await Department_setup.findAll({
    //       where:{dept_id:req.body.dept_id},
    //       include: [
    //         {
    //           model: db.dept_type,
    //           as: 'dept_type'
        
    //         }
    //       ]
    //     });
    //       if(!data2.length)
    //       {
    //         res.status(500).send({
    //           message: "Data Not Found",
    //          });
    //       }
    //       else
    //       {
            // if(data2[0].dataValues.dept_type.dept_type_name == 'Restaurant Branch')
            // {
              var arr=[];
              for(var subid of req.body.sub_pro_id)
              {
                var obj ;
                value = subid.value;
                check = { dept_id: req.body.dept_id, product_id: req.body.product_id, sub_pro_id: subid.value }
                var data1 = await  Branch_product.findAll({
                      where: check,
                      });
                  if(!data1.length)
                  {
                      Branch_product.create({
                        dept_id: req.body.dept_id,
                        product_id: req.body.product_id,
                        sub_pro_id: subid.value,
                        status:'1',
                      })
                  
                      obj= {
                        label:  subid.label+" Success",
                              }
                              arr.push(obj)
                  }
                  else
                  {
                    obj={
                      label:  subid.label+" Sub product Already assign to this branch",
                            }
                            arr.push(obj)
                    
                  }
                        
              }
                return  res.status(200).send({
                        data:arr
                      });
            // }
            // else
            // {
            //   res.status(203).send({
            //     message: "Sorry! This department type is different",
            //    });
            // }
          //}
        
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Branch_product = db1.branch_product;

  const deptid = req.params.deptid;
    Branch_product.findAll({
      where:{dept_id:deptid},
      include: [
        {
          model: db1.products,
          as: 'br_pro',
    
        },
        {
          model: db1.sub_products,
          as: 'br_sub'
        },
        {
          model: db.department_setup,
          as: 'br_dept'
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
};

exports.findAllActive = (req, res) => {
  const db1=req.ret_db
  const Branch_product = db1.branch_product;

  const deptid = req.params.deptid;
    Branch_product.findAll({
      where:{dept_id:deptid,status:1},
      include: [
        {
          model: db1.products,
          as: 'br_pro',
    
        },
        {
          model: db1.sub_products,
          as: 'br_sub',
          include: [
            {
              model: db1.subpro_rate_setup,
              as: 'subpro_rate',
              where:{status:1},
              attributes:['sub_pro_id','net_rate','discount']
            }
          ]
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
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Branch_product = db1.branch_product;

  const id = req.params.id;
  Branch_product.findByPk(id,{
    include: [
      {
        model: db1.products,
        as: 'br_pro',
  
      },
      {
        model: db1.sub_products,
        as: 'br_sub'
      },
      {
        model: db.department_setup,
        as: 'br_dept'
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
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Branch_product = db1.branch_product;

  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    Branch_product.update(req.body, {
      where: { br_pro_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Branch product was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Branch product with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Branch_product = db1.branch_product;

  const id = req.params.id;
  Branch_product.destroy({
    where: { br_pro_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Branch product was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Branch product with id=${id}`,
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
  const Branch_product = db1.branch_product;
    Branch_product.findAll({
      include: [
        {
          model: db1.products,
          as: 'br_pro',
        },
        {
          model: db1.sub_products,
          as: 'br_sub'
        },
        {
          model: db.department_setup,
          as: 'br_dept'
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
};