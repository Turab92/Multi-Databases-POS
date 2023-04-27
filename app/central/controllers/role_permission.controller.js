const db = require("../models/user");
const Role_permission = db.role_permission;
const { body,validationResult  } = require('express-validator');
const { QueryTypes } = require('sequelize');
const Sequelize = require('sequelize');
const dbConfig = require("../../confiq/db.config");

exports.validate = (method) => {
  switch (method) {
    case 'createRolePerm': {
     return [ 
          body('role_id', 'Role is required').notEmpty(),
          body('role_id', 'Role value must be in integer').isInt(),
          body('main_id', 'Mainmenu is required').notEmpty(),
          body('main_id', 'Mainmenu value must be in integer').isInt(),
       ]   
    }
    case 'updateRolePerm': {
      return [ 
          body('role_id', 'Role is required').notEmpty(),
          body('role_id', 'Role value must be in integer').isInt(),
          body('main_id', 'Mainmenu is required').notEmpty(),
          body('main_id', 'Mainmenu value must be in integer').isInt(),
          body('status', 'status is required').notEmpty(),
          body('status', 'status value must be in integer').isInt(),
        ]   
     }
  }
}

exports.create =async (req, res) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
      let check;
      if(req.body.sub_id==null){
        check = { role_id: req.body.role_id, main_id: req.body.main_id};
       var data = await Role_permission.findAll({
          where: check,
          })
            if(!data.length)
            {
                Role_permission.create({
                  role_id: req.body.role_id,
                  main_id: req.body.main_id,
                  status:'1',
                })
                .then((data) => {
                res.status(200).send(data);
                })
                .catch((err) => {
                  res.status(500).send({
                    message: err.message || "Some error occurred while create the Role Permission",
                  });
                });
            }
            else
            {
                res.status(505).send({
                  message: "Sorry! Permission Already assign to this role",
                });
            }
      }
      else
      { var arr=[];
        for(var subid of req.body.sub_id){

    var obj ;
            value = subid.value;
            check = { role_id: req.body.role_id, main_id: req.body.main_id,sub_id: subid.value }
           var data1 = await  Role_permission.findAll({
                  where: check,
                  });
                    if(!data1.length)
                    {
                        Role_permission.create({
                          role_id: req.body.role_id,
                          main_id: req.body.main_id,
                          sub_id: subid.value,
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
                        label:  subid.label+" Permission Already assign to this role",
                              }
                              arr.push(obj)
                     
                    }
                    
                  }
                  // console.log(arr);
                  return  res.status(200).send({
                          data:arr
                        });

        
      }
  }
};

exports.findAll = (req, res) => {
    Role_permission.findAll({
      include: [
        {
          model: db.mainmenu,
          as: 'main',
    
        },
        {
          model: db.submenu,
          as: 'sub'
        },
        {
          model: db.role,
          as: 'role'
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
  const id = req.params.id;
  Role_permission.findByPk(id,{
    include: [
      {
        model: db.mainmenu,
        as: 'main',
  
      },
      {
        model: db.submenu,
        as: 'sub'
      },
      {
        model: db.role,
        as: 'role'
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

// exports.findmain = (req, res) => {
//   const id = req.params.id;
//   Role_permission.findAll({
//          where: { role_id: id },
// include: [
//       {
//         model: db.mainmenu,
//         as: 'main',
	
//       },
//       {
//         model: db.submenu,
//         as: 'sub'
//       }  
//     ],
// order: [
//       ['main_id', 'ASC'],
//  ],

// 	 })
//     .then((data) => {
//      // console.log(data)
//         if(!data.length)
//         {
//            res.status(500).send({
//                    message: "Sorry! Data Not Found With Id=" + id,
//               });
            
//         }
//         else
//         {
     
//            res.status(200).send(data);
//         }
//     })
// };

exports.findmain1 = async (req, res) => {
  const id = req.params.id;

  const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases: 0,
  
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  });
  
  const result = await sequelize.query(`SELECT * FROM role_permissions as role ,mainmenus as menu ,submenus as sub where role.role_id=`+id+` and role.main_id=menu.main_id and role.sub_id= sub.sub_id ORDER BY menu.main_seq ASC,sub.sub_seq ASC`, { type: QueryTypes.SELECT });
  
  if(!result.length)
  {
     res.status(500).send({
             message: "Sorry! Data Not Found With Id=" + id,
        });
      
  }
  else
  {
     res.status(200).send(result);
  }
  
};

exports.update = (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }
  else
  {
    Role_permission.update(req.body, {
      where: { permission_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Role Permission was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Role Permission with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Role_permission.destroy({
    where: { permission_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Role Permission was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Role Permission with id=${id}`,
      });
    }
  });
};


