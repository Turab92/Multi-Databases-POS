const db = require("../../central/models/user");
const Retailer = db.retailer;
const Raw_material = db.raw_material;
const { body,validationResult  } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createPC': {
     return [ 
        // body('material_id', 'Material is required').notEmpty(),
        // body('material_id', 'Material value must be in integer').isInt(),
        body('sub_pro_id', 'Sub Product is required').notEmpty(),
        body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
        body('subpro_receipe', 'Sub product Receipe is required').isArray({ min: 1}),
        // body('unit_or_weight', 'Unit or Weight is required').notEmpty(),
        // body('unit_or_weight', 'Unit or Weight value must be in integer').isFloat(),
       ]   
    }
    case 'updatePC': {
      return [ 
         body('material_id', 'Material is required').notEmpty(),
         body('material_id', 'Material value must be in integer').isInt(),
         body('sub_pro_id', 'Sub Product is required').notEmpty(),
         body('sub_pro_id', 'Sub Product value must be in integer').isInt(),
         body('unit_or_weight', 'Unit or Weight is required').notEmpty(),
         body('unit_or_weight', 'Unit or Weight value must be in integer').isFloat(),
         body('status', 'status is required').notEmpty(),
         body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}
exports.create = async (req, res) => {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;

  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      try {
          var arr = [];
          var details= JSON.parse(JSON.stringify(req.body.subpro_receipe))
          for(sub_det of details)
          {
              //let t_cost=data.material_rate/data.material_uom*req.body.unit_or_weight;
              const product_cost = {
                material_id: sub_det.material_id,
                sub_pro_id: req.body.sub_pro_id,
                unit_or_weight: sub_det.unit_or_weight,
                cost: 0,
                status:'1',
              };
            var data1= await Product_cost.findAll({
                where:{
                  sub_pro_id: req.body.sub_pro_id,
                  material_id: sub_det.material_id
                },
                include: [
                  {
                    model: db.raw_material,
                    as: 'raw_mat_cost',
                  },
                  {
                    model: db1.sub_products,
                    as: 'subpro',
                  },
                ]
              })
                if(!data1.length)
                {
                var data= await Product_cost.create(product_cost)
                var data2 = await Raw_material.findAll({
                  where: {
                    material_id:sub_det.material_id
                  }
                })
                    var obj = {
                      material: sub_det.material_id,
                      status:"Success",
                      message:`${data2[0].dataValues.material_name} insert successfully`,
                    };
                    arr.push(obj);
                    
                }
                else
                {
                    var obj = {
                      material: sub_det.material_id,
                      status:"Error",
                      message:`Sorry ${data1[0].dataValues.raw_mat_cost.material_name} already exist on behalf of this ${data1[0].dataValues.subpro.sub_pro_name}`,
                    };
                    arr.push(obj);
                }
          }
            res.status(200).send(arr);
      }
      catch (error)
      {
        res.status(500).send(error);
      }  
     
  }
};

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;

    Product_cost.findAll({
      include: [
        {
          model: db1.sub_products,
          as: 'subpro',
    
        },
        {
          model: db.raw_material,
          as: 'raw_mat_cost',
          include: [
            {
              model: db.uom,
              as: 'uom'
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
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;

  const id = req.params.id;
  Product_cost.findByPk(id,{
    include: [
      {
        model: db1.sub_products,
        as: 'subpro',
  
      },
      {
        model: db.raw_material,
        as: 'raw_mat_cost'
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
        message: "Error retrieving Raw Material with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;

  const id = req.params.id;
  Product_cost.findAll({
    where:{
      sub_pro_id: req.body.sub_pro_id,
      material_id: req.body.material_id
    }
  })
  .then((data1) => {
        if(!data1.length)
        {
          const product_cost = {
            material_id: req.body.material_id,
            unit_or_weight: req.body.unit_or_weight,
            status:req.body.status,
          };
          Product_cost.update(product_cost, {
            where: { p_cost_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Raw Material was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Raw Material with id=${id}`,
              });
            }
          });
        }
        else{
          const product_cost = {
            unit_or_weight: req.body.unit_or_weight,
            status:req.body.status,
          };
          Product_cost.update(product_cost, {
            where: { p_cost_id: id },
          }).then((data) => {
            if (data[0] != 0) {
              res.status(200).send({
                message: "Raw Material was updated successfully",
              });
            } else {
              res.status(500).send({
                message: `Cannot update Raw Material with id=${id}`,
              });
            }
          });
        }
    });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;

  const id = req.params.id;
  Product_cost.destroy({
    where: { p_cost_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Raw Material was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Raw Material with id=${id}`,
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
  const Product_cost = db1.product_cost;

    Product_cost.findAll({
      where:{sub_pro_id:req.body.sub_pro_id},
      include: [
        {
          model: db1.sub_products,
          as: 'subpro',
        },
        {
          model: db.raw_material,
          as: 'raw_mat_cost',
          include: [
            {
              model: db.uom,
              as: 'uom'
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
    .catch((err) => {
      res.status(502).send({
        message: err.message || "Some error occured while retrieving Raw Material",
      });
    });
};
