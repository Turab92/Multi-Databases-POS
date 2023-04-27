const db = require("../models/user");
const Retailer = db.retailer;
const Department_setup = db.department_setup;
const Dept_type = db.dept_type;
const Role = db.role;
const Users = db.users;
const dbConfig = require("../../confiq/db.config");
const sequelize = require("sequelize");
const { body, validationResult } = require("express-validator");
const Op = require("sequelize").Op;
const { Pool, Client } = require("pg");

exports.validate = (method) => {
  switch (method) {
    case "createRetailer": {
      return [
        body("owner_name", "owner name is required").notEmpty(),
        body("owner_phone_no", "owner phone_no is required").notEmpty(),
        body("owner_phone_no","Minimum 10 and Maximum 12 number required in Phone number").isLength({ min: 10, max: 12 }),
        body("owner_email", "owner email is required").notEmpty(),
        body("shop_address", "shop address is required").notEmpty(),
      ];
    }
    case "updateRetailer": {
      return [
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
    var dateNow = new Date();
    var dd = dateNow.getDate();
    var monthSingleDigit = dateNow.getMonth() + 1,
      mm = monthSingleDigit < 10 ? "0" + monthSingleDigit : monthSingleDigit;
    var yy = dateNow.getFullYear().toString().substr(0);

    var d = dd + "_" + mm + "_" + yy;

    var ret_uniq_id;
    var data = await Retailer.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
    });
    if (!data.length) {
      ret_uniq_id = "RC_" + d + "_0000001";
    } else {
      arr = data[0].dataValues.retailer_unique_no.split("_").pop();
      let num = parseInt(arr) + 1;
      var last_value = num / 10000000;
      var value = last_value.toFixed(7);
      var dd = num.toString();
      if (value.toString().length < 7) {
        var temp = dd.substring(dd.indexOf("0"), dd.length);
        var data = value.toString() + temp;
        var result = data.replace("0.", "");
      } else {
        var result = value.toString().replace("0.", "");
      }
      ret_uniq_id = "RC_" + d + "_" + result;
    }

    const retailer = {
      retailer_unique_no: ret_uniq_id,
      owner_name: req.body.owner_name,
      owner_phone_no: req.body.owner_phone_no,
      owner_nic_no: req.body.owner_nic_no,
      owner_email: req.body.owner_email,
      shop_address: req.body.shop_address,
      shop_long: req.body.shop_long,
      shop_lat: req.body.shop_lat,
      shop_postal_code: req.body.shop_postal_code,
      shop_country: req.body.shop_country,
      shop_city: req.body.shop_city,
      shop_area: req.body.shop_area,
      shop_open_time: req.body.shop_open_time,
      shop_close_time: req.body.shop_close_time,
      status: 1,
      delivery_status: 0,
    };

   
      try {
          var add_retailer = await Retailer.create(retailer)
          if(add_retailer){
            
              await initialize(add_retailer);
              await add_depart(add_retailer);
              res.status(200).send(add_retailer);
            }
            else
            {
              res.status(400).send({
                message: "Data Not Inserted",
              });
            }
      } catch (error) {
        console.error(error);
        res.status(500).send({
          error,
        });
      }  
 
  }
};

async function initialize(dbName) {
  var pgtools = require("pgtools");
  const config = {
    user: dbConfig.USER,
    host: dbConfig.HOST,
    password: dbConfig.PASSWORD,
  };

  pgtools.createdb(config, dbName.dataValues.retailer_unique_no, async function (err, res){
    if (err) {
      console.error(err);
      process.exit(-1);
    }

    
    const pool = new Pool({
      user: dbConfig.USER,
      host: dbConfig.HOST,
      database: dbName.dataValues.retailer_unique_no,
      password: dbConfig.PASSWORD,
    });

    var data1 = await  pool.query(`CREATE EXTENSION postgres_fdw`);
    console.log("-----1 ",data1);

    var data2 = pool.query(`CREATE SERVER fdw_serv FOREIGN DATA WRAPPER postgres_fdw OPTIONS (host '`+dbConfig.HOST+`', dbname '`+dbConfig.DB+`', port '5432')`);
    console.log("-----2 ",data2);

    var data3 = await pool.query(`CREATE USER MAPPING FOR postgres SERVER fdw_serv OPTIONS (user '`+dbConfig.USER+`', password '`+dbConfig.PASSWORD+`')`);
    console.log("-----3 ",data3);

    var data4 = await pool.query(`IMPORT FOREIGN SCHEMA public FROM SERVER fdw_serv INTO public`);
    console.log("-----4 ",data4);

    const db1 = require("../../individual/models/ret_tables.model");
    const find = db1.getdb(dbName.dataValues.retailer_unique_no);
    await find.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Resync Db');
        initial(dbName.dataValues.retailer_unique_no);
      });;

    function initial(dbname) {
      const find = require("../../individual/models/ret_tables.model");
      const db1=find.getdb(dbname);
      const Order_types = db1.order_type;
      const Pay_types = db1.pay_type;

      Order_types.create({
        o_type_name: "Take Away",
        status:1
      });
    
      Order_types.create({
        o_type_name: "Dine In",
        status:1
      });
    
      Order_types.create({
        o_type_name: "Delivery",
        status:1
      });

      Order_types.create({
        o_type_name: "Online",
        status:1
      });

      Pay_types.create({
        p_type_name: "Card",
        status:1
      });
    
      Pay_types.create({
        p_type_name: "FOC",
        status:1
      });
    
      Pay_types.create({
        p_type_name: "Cash",
        status:1
      });

      Pay_types.create({
        p_type_name: "Barcode",
        status:1
      });
}
   
  });
  
}

async function add_depart(data) {

  var dept_type = await Dept_type.findAll({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('dept_type_name')), 
      sequelize.fn('lower', 'Mart Branch')
    )
  });

  var par_dept_type = await Dept_type.findAll({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('dept_type_name')), 
      sequelize.fn('lower', 'Warehouse')
    )
  });

  var deptname= data.dataValues.owner_name+' Mart'
  const department_setup = {
    dept_name: deptname,
    dept_type_id: dept_type[0].dataValues.dept_type_id,
    parent_dept_id: par_dept_type[0].dataValues.dept_type_id,
    retailer_id: data.dataValues.retailer_id,
    owner_name: data.dataValues.owner_name,
    owner_phone_no: data.dataValues.owner_phone_no,
    owner_email: data.dataValues.owner_email,
    shop_address: data.dataValues.shop_address,
    shop_long: data.dataValues.shop_long,
    shop_lat: data.dataValues.shop_lat,
    shop_postal_code: data.dataValues.shop_postal_code,
    shop_country: data.dataValues.shop_country,
    shop_city: data.dataValues.shop_city,
    shop_area: data.dataValues.shop_area,
    shop_open_time: data.dataValues.shop_open_time,
    shop_close_time: data.dataValues.shop_close_time,
    status:1,
    delivery_status:0
  };
  var data1 = await Department_setup.findAll({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('dept_name')), 
      sequelize.fn('lower', deptname)
    )
  })
      if(!data1.length)
        {
         var add_dept= await Department_setup.create(department_setup)
         if(add_dept)
          {
           await add_user(add_dept);
          }
        }
        else
        {
          res.status(400).send({
            message: "Data Already Exist",
           });
        }

}

async function add_user(data) {
  const Users = db.users;

  var role = await  Role.findAll({
    where: sequelize.where(
      sequelize.fn('lower', sequelize.col('name')), 
      sequelize.fn('lower','Retailer Admin')
    )
  })

  const user = {
    user_name: data.dataValues.owner_name,
    user_email: data.dataValues.owner_email,
    user_phone: data.dataValues.owner_phone_no,
    role_id: role[0].dataValues.role_id,
    dept_id: data.dataValues.dept_id,
    is_retailer: 1,
    retailer_id: data.dataValues.retailer_id,
    is_registered: 0,
    status:1,
  };
  var user_find =await Users.findAll({
    where:{user_email:data.dataValues.owner_email}
  });
  console.log("User find --------",user_find)
      if(!user_find.length)
        {
          try{
            var add_user =await Users.create(user)
          }
          catch(e){
            console.log("-----------Erros is ",e)
          }
        }
        else
        {
          res.status(500).send({
            message: "User email already exist.",
          });
        }

}

exports.findAllActive = (req, res) => {
  Retailer.findAll({
    where: { status: 1 },
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
        message: err.message || "Some error occured while retrieving Retailer",
      });
    });
};

exports.findAllActiveRetailer = async (req, res) => {
 var ret = await Retailer.findAll({
    where: { status: 1 },
    raw: true,
  });
      if (!ret.length) {
        res.status(500).send({
          message: "Data Not Found",
        });
      } 
      else
      {
        for(var dbname of ret)
        {
          const db1 = require("../../individual/models/ret_tables.model");
          const find = db1.getdb(dbname.retailer_unique_no);
          await find.sequelize.sync();
        }
        return  res.status(200).send({message:"All retailer table updated"});
      }
  
};

exports.RetailerTabLeAlter = async (req, res) => {
  var ret = await Retailer.findAll({
     where: { status: 1 },
     raw: true,
   });
       if (!ret.length) {
         res.status(500).send({
           message: "Data Not Found",
         });
       } 
       else
       {
         var arr=[];
         for(var dbname of ret)
         {
          var obj ;
          const pool = new Pool({
            user: dbConfig.USER,
            host: dbConfig.HOST,
            database: dbname.retailer_unique_no,
            password: dbConfig.PASSWORD,
          });
          try {
      
          var data1 = await  pool.query(`ALTER TABLE `+req.body.tablename+` ADD COLUMN `+req.body.column_name+` `+req.body.datatype+``);
            obj= {
                  label: dbname.retailer_unique_no+" Success",
                 }
            arr.push(obj)
          } catch (error) {
            obj= {
                  label: dbname.retailer_unique_no+" "+error,
                 }
            arr.push(obj)
          }
         }
         return  res.status(200).send({message:"All retailer table altered",
                  data:arr
                 });
       }
   
 };

 exports.RetailerForeignTabLeAlter = async (req, res) => {
  var ret = await Retailer.findAll({
     where: { status: 1 },
     raw: true,
   });
       if (!ret.length) {
         res.status(500).send({
           message: "Data Not Found",
         });
       } 
       else
       {
         var arr=[];
         for(var dbname of ret)
         {
          var obj ;
          const pool = new Pool({
            user: dbConfig.USER,
            host: dbConfig.HOST,
            database: dbname.retailer_unique_no,
            password: dbConfig.PASSWORD,
          });
          try {
      
          var data1 = await  pool.query(`ALTER FOREIGN TABLE `+req.body.tablename+` ADD COLUMN `+req.body.column_name+` `+req.body.datatype+``);
            obj= {
                  label: dbname.retailer_unique_no+" Success",
                 }
            arr.push(obj)
          } catch (error) {
            obj= {
                  label: dbname.retailer_unique_no+" "+error,
                 }
            arr.push(obj)
          }
         }
         return  res.status(200).send({message:"All retailer Foreign table column altered",
                  data:arr
                 });
       }
   
 };

 exports.RetailerForeignTabLeSync = async (req, res) => {
  var ret = await Retailer.findAll({
     where: { status: 1 },
     raw: true,
   });
       if (!ret.length) {
         res.status(500).send({
           message: "Data Not Found",
         });
       } 
       else
       {
         var arr=[];
         for(var dbname of ret)
         {
          var obj ;
          const pool = new Pool({
            user: dbConfig.USER,
            host: dbConfig.HOST,
            database: dbname.retailer_unique_no,
            password: dbConfig.PASSWORD,
          });
          try {
      
          var data1 = await  pool.query(`IMPORT FOREIGN SCHEMA public 
          LIMIT TO (`+req.body.tablename+`)
          FROM SERVER fdw_serv
          INTO public;`);
            obj= {
                  label: dbname.retailer_unique_no+" Success",
                 }
            arr.push(obj)
          } catch (error) {
            obj= {
                  label: dbname.retailer_unique_no+" "+error,
                 }
            arr.push(obj)
          }
         }
         return  res.status(200).send({message:"All retailer Foreign table column altered",
                  data:arr
                 });
       }
   
 };

 exports.RetailerTabLeColumnAlter = async (req, res) => {
  var ret = await Retailer.findAll({
     where: { status: 1 },
     raw: true,
   });
       if (!ret.length) {
         res.status(500).send({
           message: "Data Not Found",
         });
       } 
       else
       {
         var arr=[];
         for(var dbname of ret)
         {
          var obj ;
          const pool = new Pool({
            user: dbConfig.USER,
            host: dbConfig.HOST,
            database: dbname.retailer_unique_no,
            password: dbConfig.PASSWORD,
          });
          try {
      
          var data1 = await  pool.query(`ALTER TABLE `+req.body.tablename+` RENAME COLUMN `+req.body.old_column_name+` TO `+req.body.new_column_name+``);
            obj= {
                  label: dbname.retailer_unique_no+" Success",
                 }
            arr.push(obj)
          } catch (error) {
            obj= {
                  label: dbname.retailer_unique_no+" "+error,
                 }
            arr.push(obj)
          }
         }
         return  res.status(200).send({message:"All retailer table column altered",
                  data:arr
                 });
       }
   
 };

 exports.RetailerTabLeColumnDatatypeAlter = async (req, res) => {
  var ret = await Retailer.findAll({
     where: { status: 1 },
     raw: true,
   });
       if (!ret.length) {
         res.status(500).send({
           message: "Data Not Found",
         });
       } 
       else
       {
         var arr=[];
         for(var dbname of ret)
         {
          var obj ;
          const pool = new Pool({
            user: dbConfig.USER,
            host: dbConfig.HOST,
            database: dbname.retailer_unique_no,
            password: dbConfig.PASSWORD,
          });
          try {
      
          var data1 = await  pool.query(`ALTER TABLE `+req.body.tablename+` ALTER COLUMN `+req.body.column_name+` TYPE `+req.body.new_datatype+` using `+req.body.column_name+`::`+req.body.datatype);
            obj= {
                  label: dbname.retailer_unique_no+" Success",
                 }
            arr.push(obj)
          } catch (error) {
            obj= {
                  label: dbname.retailer_unique_no+" "+error,
                 }
            arr.push(obj)
          }
         }
         return  res.status(200).send({message:"All retailer table column altered",
                  data:arr
                 });
       }
   
 };
 
exports.findAllData = (req, res) => {
  Retailer.findAll()
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
        message: err.message || "Some error occured while retrieving Retailer",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Retailer.findByPk(id)
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
        message: "Error retrieving Retailer with id=" + id,
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
    Retailer.update(req.body, {
      where: { retailer_id: id },
    }).then((data) => {
      if (data[0] != 0) {
        res.status(200).send({
          message: "Retailer was updated successfully",
        });
      } else {
        res.status(500).send({
          message: `Cannot update Retailer with id=${id}`,
        });
      }
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Retailer.destroy({
    where: { retailer_id: id },
  }).then((data) => {
    if (data) {
      res.status(200).send({
        message: "Retailer was delete successfully!",
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Retailer with id=${id}`,
      });
    }
  });
};

exports.GenerateKey = async (req, res) => {
  const secreteKey1 = "66a140c2fa73930b4"
  const secreteKey2 ="fd439ef6be585dc01640ea5"
    const id = req.params.id;
    var data = await Retailer.findByPk(id)
        if (!data) {
          res.status(500).send({
            message: "Sorry! Data Not Found With Id=" + id,
          });
        } 
        else {
          if(data.dataValues.hash_key == null || data.dataValues.hash_key == '')
          {
              var key = secreteKey1 +SHA1(data.dataValues.retailer_unique_no.toString())+secreteKey2
              var ret_upt=await Retailer.update({hash_key:key}, {
                where: { retailer_id: id },
              })
              if (ret_upt[0] != 0) {
                res.status(200).send({
                  message: "Retailer Hash key was updated successfully",
                });
              } else {
                res.status(500).send({
                  message: `Cannot update Retailer with id=${id}`,
                });
              }
          }
          else
          {
            res.status(500).send({
              message: `Hash key already generated`,
            });
          }
        }
      
  };
  
  function SHA1(msg) {
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };
    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14) word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
  
    return temp.toLowerCase();
  };
  