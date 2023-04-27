const db = require("../../central/models/user");
const Retailer =db.retailer
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Sequelize = require("sequelize");
const { QueryTypes } = require('sequelize');
const dbConfig = require("../../confiq/db.config");

exports.create = async (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const Order_master = db1.order_master;
  const Product_cost = db1.product_cost;
  const Br_grn_det = db1.br_grn_det;
  const Subpro_rate_setup = db1.subpro_rate_setup;
  const Br_mat_sale = db1.br_mat_sale;

  const order_master = {
    dept_id: req.body.dept_id,
    on_om_id: req.body.on_om_id,
    day_id: req.body.day_id,
    till_id: req.body.till_id,
    ord_date: req.body.ord_date,
    cus_id: req.body.cus_id,
    user_id: req.body.user_id,
    ot_de_id: req.body.ot_de_id,
    pt_de_id: req.body.pt_de_id,
    total_amount: req.body.total_amount,
    discount: req.body.discount,
    tax_amount: req.body.tax_amount,
    delivery_charges: req.body.delivery_charges,
    net_amount: req.body.net_amount,
    cancel_reason: req.body.cancel_reason,
    status:'0',
  };

  var data = await Subpro_rate_setup.findAll({
    where: { sub_pro_id: req.body.subid, status: 1 },
  });
  if (!data.length) {
    res.status(202).send({
      message: "Sub product rate not found",
    });
  }
  var tot = data[0].dataValues.net_rate * 1;
  var disc;
  if (data[0].dataValues.discount != 0) {
    disc = (tot / 100) * data[0].dataValues.discount;
  } else {
    disc = 0;
  }

  var data1 = await Product_cost.findAll({
    where: { sub_pro_id: req.body.subid,status: 1 },
    include: [
      {
        model: db.raw_material,
        as: "raw_material",
      },
    ],
  });

  if (!data1.length) {
    res.status(202).send({
      message: "Sub product material detail not found",
    });
  } else {
    var arr = [];
    for (var det of data1) {
      var data2 = await Br_grn_det.findAll({
        where: {
          material_id: det.dataValues.material_id,
          dept_id: req.body.dept_id,
          status: 1,
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
          [
            sequelize.literal(
              `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${req.body.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
            ),
            `pr`,
          ],
          [
            sequelize.literal(
              `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${req.body.dept_id})`
            ),
            `so_qty`,
          ],
        ],
      });
      if (!data2.length) {
        res.status(500).send({
          message: "Data Not Found",
        });
      } else {
        var avlqty =parseFloat(data2[0].dataValues.recv_qty - data2[0].dataValues.so_qty).toFixed(2);
        var message;
        if (det.dataValues.unit_or_weight <= avlqty) {
          message = "Success";
        } else {
          message = "Error";
        }
        var obj = {
          material: det.dataValues.material_id,
          materialname: det.dataValues.raw_material.material_name,
          AvailQty: parseFloat(avlqty).toFixed(2),
          ReqQty: parseFloat(det.dataValues.unit_or_weight).toFixed(2),
          Message: message,
          rate: data2[0].dataValues.pr,
        };
        arr.push(obj);
      }
    }
    var flag = true;
    for (var array of arr) {
      if (array.Message == "Error") {
        flag = false;
      }
    }

    if (flag == false) {
      res.status(203).send({ data: arr });
    } else 
       {
        var om_id;
        var om_find = await Order_master.findAll({
          where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
          });
             if(om_find.length ==0 )
             {
              var om_add = await Order_master.create(order_master);
              om_id=om_add.om_id
             } 
             else
             {
              om_id=om_find[0].om_id
             }
        var sub_data = await Order_detail.findAll({
          where:{
            ord_mas_id: om_id,
            dept_id: req.body.dept_id,
            sub_pro_id: req.body.subid,
          }
        });
         if(!sub_data.length)
         {
            const order_detail = {
              ord_mas_id: om_id,
              dept_id: req.body.dept_id,
              main_pro_id: null,
              sub_pro_id: req.body.subid,
              price: data[0].dataValues.net_rate,
              quantity: 1,
              discount: disc,
              total: tot,
              net_total: tot - disc,
              status: "0",
            };
            var data4 = await Order_detail.create(order_detail);

            for (var det of data1) {
              var rate;
              for (var array of arr) {
                if (array.material == det.dataValues.material_id) {
                  rate = array.rate;
                }
              }
              const br_mat_sale = {
                om_id: data4.dataValues.ord_mas_id,
                od_id: data4.dataValues.od_id,
                dept_id: data4.dataValues.dept_id,
                sub_pro_id: data4.dataValues.sub_pro_id,
                material_id: det.dataValues.material_id,
                price: rate,
                so_unit_qty: parseFloat(det.dataValues.unit_or_weight).toFixed(2),
                total_amount: parseFloat(rate * det.dataValues.unit_or_weight).toFixed(2),
                status: "0",
              };

              var data6 = await Br_mat_sale.create(br_mat_sale);
            }
            return res.status(200).send(data);
          }
          else
          {
            const order_detail = {
              quantity: sub_data[0].dataValues.quantity+1,
              discount: sub_data[0].dataValues.discount+disc,
              total:sub_data[0].dataValues.total+tot,
              net_total: sub_data[0].dataValues.net_total+(tot - disc),
            };
            var sub_update = await Order_detail.update(order_detail,{
              where: { od_id: sub_data[0].dataValues.od_id}
            });
            for (var det of data1) {
              var rate;
              for (var array of arr) {
                if (array.material == det.dataValues.material_id) {
                  rate = array.rate;
                }
              }
              var mat_data = await Br_mat_sale.findAll({
                where:{
                  om_id: sub_data[0].dataValues.ord_mas_id,
                  od_id: sub_data[0].dataValues.od_id,
                  dept_id: sub_data[0].dataValues.dept_id,
                  sub_pro_id: sub_data[0].dataValues.sub_pro_id,
                  material_id: det.dataValues.material_id,
                }
              });
              const br_mat_sale = {
                so_unit_qty:parseFloat(mat_data[0].dataValues.so_unit_qty + det.dataValues.unit_or_weight).toFixed(2),
                total_amount:parseFloat(mat_data[0].dataValues.total_amount + rate * det.dataValues.unit_or_weight).toFixed(2),
              };
      
              var data6 = await Br_mat_sale.update(br_mat_sale,{
                where: { br_sale_id:mat_data[0].dataValues.br_sale_id }
              });
            }
            return res.status(200).send();
          }
       }
  }
};

exports.create2 = async (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const deal_setup = db1.deal_setup;
  const Order_master = db1.order_master;
  const Deal_beverages = db1.deal_beverages;
  const Br_mat_sale = db1.br_mat_sale;
  const Deal_item = db1.deal_item;

  const order_master = {
    dept_id: req.body.dept_id,
    on_om_id: req.body.on_om_id,
    day_id: req.body.day_id,
    till_id: req.body.till_id,
    ord_date: req.body.ord_date,
    cus_id: req.body.cus_id,
    user_id: req.body.user_id,
    ot_de_id: req.body.ot_de_id,
    pt_de_id: req.body.pt_de_id,
    total_amount: req.body.total_amount,
    discount: req.body.discount,
    tax_amount: req.body.tax_amount,
    delivery_charges: req.body.delivery_charges,
    net_amount: req.body.net_amount,
    cancel_reason: req.body.cancel_reason,
    status:'0',
  };

  var data11 = await deal_setup.findByPk(req.body.dealid); 
  var db_id=JSON.parse(req.body.db_id)
 
  var data2 = await Deal_item.findAll({
    where: { ds_id: req.body.dealid,status: 1 },
  });

  if (!data2.length) {
    console.log("no data")
    return res.status(202).send({
      message: "Deal Item Not Found",
    });
  } else {
    var arr2 = [];
    var addData = true;
    if(db_id != null)
    {
      var bev_data = await Deal_beverages.findAll({
        where: { db_id: db_id,status: 1 },
      });
      if (bev_data.length>0) 
        {
          var tempData = await deal_stock(bev_data[0].dataValues.sub_pro_id,req.body.dept_id,bev_data[0].dataValues.sub_qty,req);
          if(tempData.status===202){
            addData = false
          }
          arr2.push(tempData);
        }
    }
    
    for (var det of data2) {
      var data = await deal_stock(
        det.dataValues.sub_pro_id,
        req.body.dept_id,
        det.dataValues.sub_qty,
        req
      );
     
      if(data.status===202){
        addData = false
      }
      arr2.push(data.res);

    }
    if(addData==true){
    var tempOutput = [];
    for (var detarr of arr2) {
      for (var item of detarr) {
        var obj = {
          material: item.material,
          materialname: item.materialname,
          AvailQty: item.AvailQty,
          ReqQty: item.ReqQty,
          Message: item.Message,
          rate: item.rate,
        };
        tempOutput.push(obj);
      }
    }
    var finalOutput = [];
    var index = 0;
    var newObj = {};
    for (var data of tempOutput) {
      if (finalOutput.some((item) => item.material === data.material)) {
        index = finalOutput.findIndex((x) => x.material === data.material);

        newObj = {
          material: data.material,
          materialname: data.materialname,
          AvailQty: data.AvailQty,
          ReqQty: data.ReqQty + finalOutput[index].ReqQty,
          Message: "",
          rate: data.rate,
        };
        finalOutput[index] = newObj;
      } else {
        finalOutput.push(data);
      }
    }
    for (var item of finalOutput) {
      var index = finalOutput.findIndex((x) => x.material === item.material);

      var message = "";
      if (item.AvailQty >= item.ReqQty) {
        message = "Succes";
      } else {
        message = "Error";
      }
      var newObj = {
        material: item.material,
        materialname: item.materialname,
        AvailQty: parseFloat(item.AvailQty).toFixed(2),
        ReqQty: parseFloat(item.ReqQty).toFixed(2),
        Message: message,
        rate: item.rate,
      };
      finalOutput[index] = newObj;
    }
    var flag = true;
    for (var newItem of finalOutput) {
      if(newItem.Message=="Error")
      {
        flag = false;
      }
    }
    if(flag== false)
      {
        res.status(203).send({"data":finalOutput});
      }
      else
      {
        // var sub_data = await Order_detail.findAll({
        //   where:{
        //     ord_mas_id: req.params.om_id,
        //     dept_id: req.params.dept_id,
        //     ds_id: data11.ds_id,
        //   }
          
        // });
        //  if(!sub_data.length)
        //  {
          var om_id;
          var om_find = await Order_master.findAll({
            where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
            });
               if(om_find.length ==0 )
               {
                var om_add = await Order_master.create(order_master);
                om_id=om_add.om_id
               } 
               else
               {
                om_id=om_find[0].om_id
               }

            const order_detail = {
              ord_mas_id: om_id,
              dept_id: req.body.dept_id,
              main_pro_id: null,
              ds_id: data11.ds_id,
              db_id: db_id,
              price: data11.price,
              discount:0,
              quantity: 1,
              total: data11.price * 1,
              net_total:data11.price * 1,
              status: "0",
            };
            var data3 = await Order_detail.create(order_detail);
            for (var det of finalOutput) {
            
              const br_mat_sale = {
                om_id: data3.dataValues.ord_mas_id,
                od_id: data3.dataValues.od_id,
                dept_id: data3.dataValues.dept_id,
                ds_id: data3.dataValues.ds_id,
                material_id: det.material,
                so_unit_qty: parseFloat(det.ReqQty).toFixed(2),
                price: det.rate,
                total_amount: parseFloat(det.rate * det.ReqQty).toFixed(2),
                status: "0",
              };
      
              var data6 = await Br_mat_sale.create(br_mat_sale);
            }
            return  res.status(200).send(data3);
        //  }
          // else
          // {
          //   const order_detail = {
          //     quantity: parseFloat(sub_data[0].dataValues.quantity)+1,
          //     total:(parseFloat(sub_data[0].dataValues.total)+parseFloat(data11.price)).toFixed(2),
          //     net_total: (parseFloat(sub_data[0].dataValues.net_total)+parseFloat(data11.price)).toFixed(2),
          //   };
          //   var sub_update = await Order_detail.update(order_detail,{
          //     where: { od_id: sub_data[0].dataValues.od_id}
          //   });
          //   for (var det of finalOutput) {
          //     var mat_data = await Br_mat_sale.findAll({
          //       where:{
          //         om_id: sub_data[0].dataValues.ord_mas_id,
          //         od_id: sub_data[0].dataValues.od_id,
          //         dept_id: sub_data[0].dataValues.dept_id,
          //         ds_id: sub_data[0].dataValues.ds_id,
          //         material_id: det.material,
          //       }
          //     });
          //     const br_mat_sale = {
          //       so_unit_qty:(parseFloat(mat_data[0].dataValues.so_unit_qty) + parseFloat(det.ReqQty)).toFixed(2),
          //       total_amount:(parseFloat(mat_data[0].dataValues.total_amount) + parseFloat(det.rate * det.ReqQty)).toFixed(2),
          //     };
      
          //     var data6 = await Br_mat_sale.update(br_mat_sale,{
          //       where: { br_sale_id:mat_data[0].dataValues.br_sale_id }
          //     });
          //   }
          //   return res.status(200).send();
          // }
      }
  }
  else{
    res.status(202).send({"message":"Some Sub product details OR Sales and Purchase history not found"});
  }
  }
  
};

// -------->
exports.order_place = async (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const Order_master = db1.order_master;
  const Product_cost = db1.product_cost;
  const Br_grn_det = db1.br_grn_det;
  const Subpro_rate_setup = db1.subpro_rate_setup;
  const Br_mat_sale = db1.br_mat_sale;
  const deal_setup = db1.deal_setup;
  const Deal_beverages = db1.deal_beverages;
  const Deal_item = db1.deal_item;
  const Order_type_detail = db1.ord_type_detail;
  const Pay_type_detail = db1.pay_type_detail;
  const Customers = db1.customers;


  var error = [];
// ---->loop
var details= JSON.parse(JSON.stringify(req.body.details))
for(sub_det of details){
  if(sub_det.ord_det == 'subpro')
  {
  var data = await Subpro_rate_setup.findAll({
    where: { sub_pro_id: sub_det.sub_pro_id, status: 1 },
  });
  if (!data.length) {
    var obj = {
      subproduct: sub_det.sub_pro_id,
      message:"Sub product rate not found",
    };
    error.push(obj);  
  }

  var data1 = await Product_cost.findAll({
    where: { sub_pro_id: sub_det.sub_pro_id,status: 1 },
    include: [
      {
        model: db.raw_material,
        as: "raw_mat_cost",
      },
    ],
  });

  if (!data1.length) {
    var obj = {
      subproduct: sub_det.sub_pro_id,
      message:"Sub product material recipe details not found",
    };
    error.push(obj);
  } else
   {
        var arr = [];
        for (var det of data1) {
          var data2 = await Br_grn_det.findAll({
            where: {
              material_id: det.dataValues.material_id,
              dept_id: req.body.dept_id,
              status: 1,
            },
            attributes: [
              [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
              [
                sequelize.literal(
                  `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${req.body.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
                ),
                `pr`,
              ],
              [
                sequelize.literal(
                  `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${req.body.dept_id})`
                ),
                `so_qty`,
              ],
            ],
          });
          if (!data2.length) 
          {
            var obj = {
              subproduct: sub_det.sub_pro_id,
              material_id: det.dataValues.material_id,
              message:"Sorry Material purchase and sale details not found",
            };
            error.push(obj);
          } 
          else
          {
            var avlqty =data2[0].dataValues.recv_qty - data2[0].dataValues.so_qty;
            var message;
            var use_aty=det.dataValues.unit_or_weight * sub_det.quantity
            if (use_aty <= avlqty) {
              message = "Success";
            } else {
              message = "Error";
            }
            var obj = {
              material: det.dataValues.material_id,
              materialname: det.dataValues.raw_mat_cost.material_name,
              AvailQty: avlqty,
              ReqQty: use_aty,
              error_Message: message,
              rate: data2[0].dataValues.pr,
            };
            arr.push(obj);
          }
        }
        for (var array of arr) {
          if (array.error_Message == "Error") {
            var obj = {
              subproduct: sub_det.sub_pro_id,
              inventory_error: array,
              message:"Sorry Sub Product Material Quantity not found",
            };
            error.push(obj);
          }
        }
    }
   }
   else if(sub_det.ord_det == 'deal')
   {
    var data11 = await deal_setup.findByPk(sub_det.deal_id); 
    var db_id=JSON.parse(sub_det.db_id)
   
    var data2 = await Deal_item.findAll({
      where: { ds_id: sub_det.deal_id, status: 1 },
    });
    console.log(data2)
    if (!data2.length) {
      var obj = {
        deal: sub_det.deal_id,
        message:"Deal Item Not Found",
      };
      error.push(obj);
    } else {
      var arr2 = [];
      var addData = true;
      if(db_id != null)
      {
        var bev_data = await Deal_beverages.findAll({
          where: { db_id: db_id,status: 1 },
        });
        if (bev_data.length>0) 
        {
          var tempData = await deal_stock(bev_data[0].dataValues.sub_pro_id,req.body.dept_id,bev_data[0].dataValues.sub_qty,req);

          if(tempData.status===202){
            addData = false
          }
          arr2.push(tempData);
        }
      }
      
      for (var det of data2) {
        var data = await deal_stock(
          det.dataValues.sub_pro_id,
          req.body.dept_id,
          det.dataValues.sub_qty,
          req
        );
        console.log(data)
        if(data.status===202){
          addData = false
        }
        arr2.push(data.res);
  
      }
      if(addData==true){
          var tempOutput = [];
          for (var detarr of arr2) {
            for (var item of detarr) {
              var obj = {
                material: item.material,
                materialname: item.materialname,
                AvailQty: item.AvailQty,
                ReqQty: item.ReqQty,
                Message: item.Message,
                rate: item.rate,
              };
              tempOutput.push(obj);
            }
          }
          var finalOutput = [];
          var index = 0;
          var newObj = {};
          for (var data of tempOutput) {
            if (finalOutput.some((item) => item.material === data.material)) {
              index = finalOutput.findIndex((x) => x.material === data.material);
      
              newObj = {
                material: data.material,
                materialname: data.materialname,
                AvailQty: data.AvailQty,
                ReqQty: data.ReqQty + finalOutput[index].ReqQty,
                Message: "",
                rate: data.rate,
              };
              finalOutput[index] = newObj;
            } else {
              finalOutput.push(data);
            }
          }
          for (var item of finalOutput) {
            var index = finalOutput.findIndex((x) => x.material === item.material);
      
            var message = "";
            if (item.AvailQty >= item.ReqQty) {
              message = "Succes";
            } else {
              message = "Error";
            }
            var newObj = {
              material: item.material,
              materialname: item.materialname,
              AvailQty: parseFloat(item.AvailQty).toFixed(2),
              ReqQty: parseFloat(item.ReqQty).toFixed(2),
              Message: message,
              rate: item.rate,
            };
            finalOutput[index] = newObj;
          }
          for (var newItem of finalOutput) {
            if(newItem.Message=="Error")
            {
              var obj = {
                deal: sub_det.deal_id,
                inventory_error:newItem,
                message:"Sorry Deal Material Quantity Not Found",
              };
              error.push(obj);
            }
          }     
    }
    else{
      var obj = {
        deal: sub_det.deal_id,
        message:"Some Sub product details OR Sales and Purchase history not found",
      };
      error.push(obj);
    }
    }
   }
   //---
}
  // <------ loop

// -----> add
if(!error.length){
var om_id;
var om_find = await Order_master.findAll({
  where: { user_id:req.body.user_id,status:0,dept_id:req.body.dept_id },
  });
     if(om_find.length ==0 )
     {
      const ord_type_detail = {
        ord_type_id: req.body.ord_type_id,
        cus_id: req.body.cus_id,
        cus_name: req.body.cus_name,
        cus_phone: req.body.cus_phone,
        cus_email: req.body.cus_email,
        cus_address: req.body.cus_address,
        table_no: req.body.table_no,
        members: req.body.members,
        ord_booker: req.body.ord_booker,
        del_person: req.body.del_person,
        del_phone: req.body.del_phone,
        order_type: req.body.order_type,
        online_type: req.body.online_type,
        status:req.body.status,
      };
      var ot_det = await Order_type_detail.create(ord_type_detail)

      const paym_type_detail = {
        pay_type_id: req.body.pay_type_id,
        cus_id: req.body.cus_id,
        card_no: req.body.card_no,
        card_type: req.body.card_type,
        acc_title: req.body.acc_title,
        bank_name: req.body.bank_name,
        per_name: req.body.per_name,
        per_phone: req.body.per_phone,
        per_email: req.body.per_email,
        reason: req.body.reason,
        cash_received: req.body.cash_received,
        cash_return: req.body.cash_return,
        status:req.body.status,
      };
      var pt_det = await Pay_type_detail.create(paym_type_detail)

      if(req.body.is_customer==1)
      {
        const customer = {
          cus_name: req.body.cus_name,
          cus_phone: req.body.cus_phone,
          cus_email: req.body.cus_email,
          cus_address: req.body.cus_address,
          status:1,
        };
       var find_cus= await Customers.findAll({
          where:{ cus_phone: req.body.cus_phone}
        })
          if(!find_cus.length)
          {
             var add_cus= await Customers.create(customer)
                  cus_id = add_cus.cus_id
          }
          else
          {
            cus_id = find_cus[0].dataValues.cus_id
          }
      }
      else{
        cus_id=null
      }

      const order_master = {
        dept_id: req.body.dept_id,
        on_om_id: req.body.on_om_id,
        day_id: req.body.day_id,
        shift_id: req.body.shift_id,
        till_id: req.body.till_id,
        ord_date: req.body.ord_date,
        ord_notes: req.body.ord_notes,
        cus_id: cus_id,
        user_id: req.body.user_id,
        item_total: req.body.item_total,
        deal_total: req.body.deal_total,
        ot_de_id: ot_det.ot_d_id,
        pt_de_id: pt_det.pt_d_id,
        total_amount: req.body.total_amount,
        disc_id: req.body.disc_id,
        discount: req.body.discount,
        net_item: req.body.net_item,
        tax_id: req.body.tax_id,
        tax_amount: req.body.tax_amount,
        delivery_charges: req.body.delivery_charges,
        net_amount: req.body.net_amount,
        cancel_reason: req.body.cancel_reason,
        is_print: req.body.is_print,
        kit_print: req.body.kit_print,
        status:req.body.status,
      };
      var om_add = await Order_master.create(order_master);
      om_id=om_add.om_id

      // ----->loop
      for(sub_det of details)
      {
        if(sub_det.ord_det == 'subpro')
        {
          var data = await Subpro_rate_setup.findAll({
            where: { sub_pro_id: sub_det.sub_pro_id, status: 1 },
          });

          var tot = data[0].dataValues.net_rate * sub_det.quantity;
          var disc;
          if (data[0].dataValues.discount != 0) {
            disc = (tot / 100) * data[0].dataValues.discount;
          } else {
            disc = 0;
          }
          var sub_data = await Order_detail.findAll({
            where:{
              ord_mas_id: om_id,
              dept_id: req.body.dept_id,
              sub_pro_id: sub_det.sub_pro_id,
            }
          });
          if(!sub_data.length)
          {
              const order_detail = {
                ord_mas_id: om_id,
                dept_id: req.body.dept_id,
                main_pro_id: null,
                sub_pro_id: sub_det.sub_pro_id,
                price: data[0].dataValues.net_rate,
                quantity: sub_det.quantity,
                discount: disc,
                total: tot,
                net_total: tot - disc,
                status: req.body.status,
              };
              var data4 = await Order_detail.create(order_detail);
          
              for (var det of data1) {
                var rate;
                for (var array of arr) {
                  if (array.material == det.dataValues.material_id) {
                    rate = array.rate;
                  }
                }
                const br_mat_sale = {
                  om_id: data4.dataValues.ord_mas_id,
                  od_id: data4.dataValues.od_id,
                  dept_id: data4.dataValues.dept_id,
                  sub_pro_id: data4.dataValues.sub_pro_id,
                  material_id: det.dataValues.material_id,
                  price: rate,
                  so_unit_qty: parseFloat(det.dataValues.unit_or_weight*sub_det.quantity).toFixed(2),
                  total_amount: parseFloat((rate * det.dataValues.unit_or_weight)*sub_det.quantity).toFixed(2),
                  status:req.body.status,
                };
          
                var data6 = await Br_mat_sale.create(br_mat_sale);
              }
              
            }
            else
            {
              const order_detail = {
                quantity: sub_data[0].dataValues.quantity+sub_det.quantity,
                discount: sub_data[0].dataValues.discount+disc,
                total:sub_data[0].dataValues.total+tot,
                net_total: sub_data[0].dataValues.net_total+(tot - disc),
              };
              var sub_update = await Order_detail.update(order_detail,{
                where: { od_id: sub_data[0].dataValues.od_id}
              });
              for (var det of data1) {
                var rate;
                for (var array of arr) {
                  if (array.material == det.dataValues.material_id) {
                    rate = array.rate;
                  }
                }
                var mat_data = await Br_mat_sale.findAll({
                  where:{
                    om_id: sub_data[0].dataValues.ord_mas_id,
                    od_id: sub_data[0].dataValues.od_id,
                    dept_id: sub_data[0].dataValues.dept_id,
                    sub_pro_id: sub_data[0].dataValues.sub_pro_id,
                    material_id: det.dataValues.material_id,
                  }
                });
                const br_mat_sale = {
                  so_unit_qty:parseFloat(mat_data[0].dataValues.so_unit_qty + (det.dataValues.unit_or_weight*sub_det.quantity)).toFixed(2),
                  total_amount:parseFloat(mat_data[0].dataValues.total_amount + ((rate * det.dataValues.unit_or_weight)*sub_det.quantity)).toFixed(2),
                };
          
                var data6 = await Br_mat_sale.update(br_mat_sale,{
                  where: { br_sale_id:mat_data[0].dataValues.br_sale_id }
                });
              }
              
            }
         }
         else if(sub_det.ord_det == 'deal')
         {
          var arr2 = [];
          var data11 = await deal_setup.findByPk(sub_det.deal_id);
          var db_id=JSON.parse(sub_det.db_id)

          var data2 = await Deal_item.findAll({
            where: { ds_id: sub_det.deal_id,status: 1 },
          });
          if(db_id != null)
          {
            var bev_data = await Deal_beverages.findAll({
              where: { db_id: db_id,status: 1 },
            });
            if (bev_data.length>0) 
            {
                var tempData = await deal_stock(bev_data[0].dataValues.sub_pro_id,req.body.dept_id,bev_data[0].dataValues.sub_qty,req);
                arr2.push(tempData);
            }
          }
          for (var det of data2) {
            var data = await deal_stock(
              det.dataValues.sub_pro_id,
              req.body.dept_id,
              det.dataValues.sub_qty,
              req
            );
            arr2.push(data.res);
      
          }
          var tempOutput = [];
          for (var detarr of arr2) {
            for (var item of detarr) {
              var obj = {
                material: item.material,
                materialname: item.materialname,
                AvailQty: item.AvailQty,
                ReqQty: item.ReqQty,
                Message: item.Message,
                rate: item.rate,
              };
              tempOutput.push(obj);
            }
          }
          var finalOutput = [];
          var index = 0;
          var newObj = {};
          for (var data of tempOutput) {
            if (finalOutput.some((item) => item.material === data.material)) {
              index = finalOutput.findIndex((x) => x.material === data.material);

              newObj = {
                material: data.material,
                materialname: data.materialname,
                AvailQty: data.AvailQty,
                ReqQty: data.ReqQty + finalOutput[index].ReqQty,
                Message: "",
                rate: data.rate,
              };
              finalOutput[index] = newObj;
            } else {
              finalOutput.push(data);
            }
          }

          const order_detail = {
            ord_mas_id: om_id,
            dept_id: req.body.dept_id,
            main_pro_id: null,
            ds_id: data11.ds_id,
            db_id: db_id,
            price: data11.price,
            discount:0,
            quantity: 1,
            total: data11.price * 1,
            net_total:data11.price * 1,
            status: req.body.status,
          };
          var data3 = await Order_detail.create(order_detail);
          
          for (var det of finalOutput) {
          
            const br_mat_sale = {
              om_id: data3.dataValues.ord_mas_id,
              od_id: data3.dataValues.od_id,
              dept_id: data3.dataValues.dept_id,
              ds_id: data3.dataValues.ds_id,
              material_id: det.material,
              so_unit_qty: parseFloat(det.ReqQty).toFixed(2),
              price: det.rate,
              total_amount: parseFloat(det.rate * det.ReqQty).toFixed(2),
              status: req.body.status,
            };
    
            var data6 = await Br_mat_sale.create(br_mat_sale);
          }
         }
        }
        // <-----loop
        return res.status(200).send(om_add);
     } 
     else
     {
      res.status(202).send({
        message:"Please close the previous order",
      });
     }

}
else{
  res.status(202).send({
    message:"Some error occured while placing order",
    Error:error
  });
}
// <----- add
};
// <--------

async function deal_stock(sub_id, dept_id, qty, req) {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;
  const Br_grn_det = db1.br_grn_det;

  var data1 = await Product_cost.findAll({
    where: { sub_pro_id: sub_id,status: 1 },
    include: [
      {
        model: db.raw_material,
        as: "raw_mat_cost",
      },
    ],
  });

  if (!data1.length) {
    return  {
      message: "Sub product material detail not found",
      status:202,
      res:[]
    };
  } else {
    var arr = [];
    for (var det of data1) {
      var data2 = await Br_grn_det.findAll({
        where: {
          material_id: det.dataValues.material_id,
          dept_id: dept_id,
          status: 1,
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
          [
            sequelize.literal(
              `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
            ),
            `pr`,
          ],
          [
            sequelize.literal(
              `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${dept_id})`
            ),
            `so_qty`,
          ],
        ],
      });
      if (!data2.length) {
        // res.status(500).send({
        //   message: "Data Not Found",
        // });
        return  {
          message: "Data not found",
          status:202,
          res:[]
        };
      } else {
        
        var avlqty = parseFloat(data2[0].dataValues.recv_qty - data2[0].dataValues.so_qty).toFixed(2);
        var message;
        var tot_qty =parseFloat(det.dataValues.unit_or_weight * qty).toFixed(2);
        if (tot_qty <= avlqty) {
          message = "Success";
        } else {
          message = "Error";
        }
        var obj = {
          material: det.dataValues.material_id,
          materialname: det.dataValues.raw_mat_cost.material_name,
          AvailQty: avlqty,
          ReqQty: tot_qty,
          Message: message,
          rate: data2[0].dataValues.pr,
        };
        arr.push(obj);
      }
    }
    return{
      message: "Success",
      status:200,
      res:arr
    };
    
 
  }
}

async function deal_stock2(sub_id, dept_id, qty,res,req) {
  const db1=req.ret_db
  const Product_cost = db1.product_cost;
  const Br_grn_det = db1.br_grn_det;

  var data1 = await Product_cost.findAll({
    where: { sub_pro_id: sub_id,status: 1 },
    include: [
      {
        model: db.raw_material,
        as: "raw_mat_cost",
      },
    ],
  });

  if (!data1.length) {
    return res.status(202).send({
      message: "Sub product material detail not found",
    });
  } else {
    var arr = [];
    for (var det of data1) {
      var data2 = await Br_grn_det.findAll({
        where: {
          material_id: det.dataValues.material_id,
          dept_id: dept_id,
          status: 1,
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
          [
            sequelize.literal(
              `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
            ),
            `pr`,
          ],
          [
            sequelize.literal(
              `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${dept_id})`
            ),
            `so_qty`,
          ],
        ],
      });
      if (!data2.length) {
        res.status(500).send({
          message: "Data Not Found",
        });
      } else {
        var tot_qty = parseFloat(det.dataValues.unit_or_weight * qty).toFixed(2);
        var obj = {
          material: det.dataValues.material_id,
          ReqQty: tot_qty,
          rate: data2[0].dataValues.pr,
        };
        arr.push(obj);
      }
    }
    return {
      message: "Success",
      status:200,
      res:arr
    };
  }
}

exports.findAll = (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const Order_master = db1.order_master;

  let userid = req.params.id;
  Order_master.findAll({
    where: { user_id: userid, status: 0 },
  })
    .then((data) => {
      if (data.length != 0) {
        Order_detail.findAll({
          where: { ord_mas_id: data[0].om_id, status: 0 },
          include: [
            {
              model: db1.sub_products,
              as: "sub_products",
            },
            {
              model: db1.deal_setup,
              as: "deal_setups",
            },
          ],
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
                err.message ||
                "Some error occured while retrieving Order Detail",
            });
          });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while create the Order Master",
      });
    });
};

exports.findOne = (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;

  const id = req.params.id;
  Order_detail.findByPk(id)
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
        message: "Error retrieving Order Detail with id=" + id,
      });
    });
};

exports.update = async (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const deal_setup = db1.deal_setup;
  const Product_cost = db1.product_cost;
  const Deal_beverages = db1.deal_beverages;
  const Br_grn_det = db1.br_grn_det;
  const Subpro_rate_setup = db1.subpro_rate_setup;
  const Br_mat_sale = db1.br_mat_sale;
  const Deal_item = db1.deal_item;

  const id = req.params.id;
  var data = await Order_detail.findByPk(id);//findone or findByPK return object
  
  if(data.ds_id==null)
  {
    var data5 = await Subpro_rate_setup.findAll({
      where: { sub_pro_id: data.sub_pro_id, status: 1 },
    });
    if (!data5.length) {
      res.status(202).send({
        message: "Sub product rate not found",
      });
    }
    var tot = data5[0].dataValues.net_rate * req.body.quantity;
    var disc;
    if (data5[0].dataValues.discount != 0) {
      disc = (tot / 100) * data5[0].dataValues.discount;
    } else {
      disc = 0;
    }
    const order_detail = {
      quantity: req.body.quantity,
      discount: disc,
      total: tot,
      net_total: tot - disc
    };
    var data1 = await Product_cost.findAll({
      where: { sub_pro_id: data.sub_pro_id,status: 1 },
      include: [
        {
          model: db.raw_material,
          as: "raw_mat_cost",
        },
      ],
    });
  
    if (!data1.length) {
      res.status(202).send({
        message: "Sub product material detail not found",
      });
    } else {
      var arr = [];
      for (var det of data1) {
        var data2 = await Br_grn_det.findAll({
          where: {
            material_id: det.dataValues.material_id,
            dept_id: data.dept_id,
            status: 1,
          },
          attributes: [
            [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
            [
              sequelize.literal(
                `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${data.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
              ),
              `pr`,
            ],
            [
              sequelize.literal(
                `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${data.dept_id})`
              ),
              `so_qty`,
            ],
          ],
        });
        if (!data2.length) {
          res.status(500).send({
            message: "Data Not Found",
          });
        } else {
          var avlqty = parseFloat(data2[0].dataValues.recv_qty - data2[0].dataValues.so_qty).toFixed(2);
          var message;
          if (det.dataValues.unit_or_weight <= avlqty) {
            message = "Success";
          } else {
            message = "Error";
          }
          var obj = {
            material: det.dataValues.material_id,
            materialname: det.dataValues.raw_mat_cost.material_name,
            AvailQty: parseFloat(avlqty).toFixed(2),
            ReqQty: parseFloat(det.dataValues.unit_or_weight).toFixed(2),
            Message: message,
            rate: data2[0].dataValues.pr,
          };
          arr.push(obj);
        }
      }
      var flag = true;
      for (var array of arr) {
        if (array.Message == "Error") {
          flag = false;
        }
      }
  
      if (flag == false) {
        res.status(203).send({ data: arr });
      } else {
        var data4 = await Order_detail.update(order_detail,{
          where: { od_id: id }
        });
        for (var det of data1) {
          var rate;
          for (var array of arr) {
            if (array.material == det.dataValues.material_id) {
              rate = array.rate;
            }
          }
          const br_mat_sale = {
            so_unit_qty: parseFloat(det.dataValues.unit_or_weight*req.body.quantity).toFixed(2),
            total_amount: parseFloat(rate * det.dataValues.unit_or_weight*req.body.quantity).toFixed(2),
          };
  
          var data6 = await Br_mat_sale.update(br_mat_sale,{
            where: { om_id: data.ord_mas_id, 
                     od_id: id,
                     sub_pro_id: data.sub_pro_id,
                     material_id: det.dataValues.material_id,
                   }
          });
        }
        return res.status(200).send();
      }
    }
  }
  else if(data.sub_pro_id==null)
  {
    var data1 = await deal_setup.findByPk(data.ds_id);
    
      const order_detail = {
        quantity: req.body.quantity,
        total: data1.price * req.body.quantity,
        net_total:data1.price * req.body.quantity,
      };
      var data2 = await Deal_item.findAll({
        where: { ds_id: data.ds_id,status: 1 },
      });
      if (!data2.length) {
        res.status(500).send({
          message: "Data Not Found",
        });
      } else {
        var arr2 = [];
        if(data.db_id != null)
        {
          var bev_data = await Deal_beverages.findAll({
            where: { db_id: data.db_id,status: 1 },
          });
          if (bev_data.length>0) 
          {
            var tempData = await deal_stock(bev_data[0].dataValues.sub_pro_id,data.dept_id,bev_data[0].dataValues.sub_qty,req);
            arr2.push(tempData);
          }
        }
        for (var det of data2) {
          var data6 = await deal_stock(
            det.dataValues.sub_pro_id,
            data.dept_id,
            det.dataValues.sub_qty,
            req
          );
          arr2.push(data6.res);
        }
        var tempOutput = [];
        for (var detarr of arr2) {
          for (var item of detarr) {
            var obj = {
              material: item.material,
              materialname: item.materialname,
              AvailQty: item.AvailQty,
              ReqQty: item.ReqQty,
              Message: item.Message,
              rate: item.rate,
            };
            tempOutput.push(obj);
          }
        }
        var finalOutput = [];
        var index = 0;
        var newObj = {};
        for (var data7 of tempOutput) {
          if (finalOutput.some((item) => item.material === data7.material)) {
            index = finalOutput.findIndex((x) => x.material === data7.material);

            newObj = {
              material: data7.material,
              materialname: data7.materialname,
              AvailQty: data7.AvailQty,
              ReqQty: data7.ReqQty + finalOutput[index].ReqQty,
              Message: "",
              rate: data7.rate,
            };
            finalOutput[index] = newObj;
          } else {
            finalOutput.push(data7);
          }
        }
        for (var item of finalOutput) {
          var index = finalOutput.findIndex((x) => x.material === item.material);

          var message = "";
          if (item.AvailQty >= item.ReqQty) {
            message = "Succes";
          } else {
            message = "Error";
          }
          var newObj = {
            material: item.material,
            materialname: item.materialname,
            AvailQty: parseFloat(item.AvailQty).toFixed(2),
            ReqQty: parseFloat(item.ReqQty).toFixed(2),
            Message: message,
            rate: item.rate,
          };
          finalOutput[index] = newObj;
        }
        var flag = true;
        for (var newItem of finalOutput) {
          if(newItem.Message=="Error")
          {
            flag = false;
          }
        }
        if(flag== false)
          {
            res.status(203).send({"data":finalOutput});
          }
          else
          {
            var data3 = await Order_detail.update(order_detail,{
              where: { od_id: id }
            });
            for (var det of finalOutput) {
              
              const br_mat_sale = {
                so_unit_qty: parseFloat(det.ReqQty * req.body.quantity).toFixed(2),
                total_amount: parseFloat(det.rate * det.ReqQty * req.body.quantity).toFixed(2),
              };
              var data6 = await Br_mat_sale.update(br_mat_sale,{
                where: { om_id: data.ord_mas_id, 
                         od_id: id,
                         ds_id: data.ds_id,
                         material_id: det.material,
                       }
                      });
            }
            return  res.status(200).send(data3);
          }
      }


  }
 
};

exports.update2 = async (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const deal_setup = db1.deal_setup;
  const Product_cost = db1.product_cost;
  const Deal_beverages = db1.deal_beverages;
  const Br_grn_det = db1.br_grn_det;
  const Subpro_rate_setup = db1.subpro_rate_setup;
  const Br_mat_sale = db1.br_mat_sale;
  const Deal_item = db1.deal_item;

  const id = req.params.id;
  var data = await Order_detail.findByPk(id);//findone or findByPK return object
  
  if(data.ds_id==null)
  {
    var data5 = await Subpro_rate_setup.findAll({
      where: { sub_pro_id: data.sub_pro_id, status: 1 },
    });
    if (!data5.length) {
      res.status(202).send({
        message: "Sub product rate not found",
      });
    }
    var tot = data5[0].dataValues.net_rate * req.body.quantity;
    var disc;
    if (data5[0].dataValues.discount != 0) {
      disc = (tot / 100) * data5[0].dataValues.discount;
    } else {
      disc = 0;
    }
    const order_detail = {
      quantity: req.body.quantity,
      discount: disc,
      total: tot,
      net_total: tot - disc
    };
    var data1 = await Product_cost.findAll({
      where: { sub_pro_id: data.sub_pro_id,status: 1 },
      include: [
        {
          model: db.raw_material,
          as: "raw_mat_cost",
        },
      ],
    });
  
    if (!data1.length) {
      res.status(202).send({
        message: "Sub product material detail not found",
      });
    } else {
      var arr = [];
      for (var det of data1) {
        var data2 = await Br_grn_det.findAll({
          where: {
            material_id: det.dataValues.material_id,
            dept_id: data.dept_id,
            status: 1,
          },
          attributes: [
            [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
            [
              sequelize.literal(
                `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${data.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
              ),
              `pr`,
            ],
            [
              sequelize.literal(
                `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${data.dept_id})`
              ),
              `so_qty`,
            ],
          ],
        });
        if (!data2.length) {
          res.status(500).send({
            message: "Data Not Found",
          });
        } else {

          var obj = {
            material: det.dataValues.material_id,
            rate: data2[0].dataValues.pr,
          };
          arr.push(obj);
        }
      }
        var data4 = await Order_detail.update(order_detail,{
          where: { od_id: id }
        });
        for (var det of data1) {
          var rate;
          for (var array of arr) {
            if (array.material == det.dataValues.material_id) {
              rate = array.rate;
            }
          }
          const br_mat_sale = {
            so_unit_qty: parseFloat(det.dataValues.unit_or_weight*req.body.quantity).toFixed(2),
            total_amount: parseFloat(rate * det.dataValues.unit_or_weight*req.body.quantity).toFixed(2),
          };
  
          var data6 = await Br_mat_sale.update(br_mat_sale,{
            where: { om_id: data.ord_mas_id, 
                     od_id: id,
                     sub_pro_id: data.sub_pro_id,
                     material_id: det.dataValues.material_id,
                   }
          });
        }
        return res.status(200).send();
      
    }
  }
  else if(data.sub_pro_id==null)
  {
    var data1 = await deal_setup.findByPk(data.ds_id);
      const order_detail = {
        quantity: req.body.quantity,
        total: data1.price * req.body.quantity,
        net_total:data1.price * req.body.quantity,
      };
      var data2 = await Deal_item.findAll({
        where: { ds_id: data.ds_id,status: 1 },
      });
      if (!data2.length) {
        res.status(500).send({
          message: "Data Not Found",
        });
      } else {
        var arr2 = [];
        if(data.db_id != null)
        {
          var bev_data = await Deal_beverages.findAll({
            where: { db_id: data.db_id,status: 1 },
          });
          if (bev_data.length>0) 
          {
            var tempData = await deal_stock(bev_data[0].dataValues.sub_pro_id,data.dept_id,bev_data[0].dataValues.sub_qty,req);
            arr2.push(tempData);
          }
        }
        for (var det of data2) {
          var data6 = await deal_stock2(
            det.dataValues.sub_pro_id,
            data.dept_id,
            det.dataValues.sub_qty,
            req
          );
          arr2.push(data6.res);
        }
        var tempOutput = [];
        for (var detarr of arr2) {
          for (var item of detarr) {
            var obj = {
              material: item.material,
              ReqQty: item.ReqQty,
              rate: item.rate,
            };
            tempOutput.push(obj);
          }
        }
      
     
     
            var data3 = await Order_detail.update(order_detail,{
              where: { od_id: id }
            });
            for (var det of tempOutput) {
        
              const br_mat_sale = {
                so_unit_qty: parseFloat(det.ReqQty * req.body.quantity).toFixed(2),
                total_amount: parseFloat(det.rate * det.ReqQty * req.body.quantity).toFixed(2),
              };
              var data6 = await Br_mat_sale.update(br_mat_sale,{
                where: { om_id: data.ord_mas_id, 
                         od_id: id,
                         ds_id: data.ds_id,
                         material_id: det.material,
                       }
                      });
            }
            return  res.status(200).send(data3);
          
      }
  }
 
};

exports.update_detail = (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const Br_mat_sale = db1.br_mat_sale;

  const id = req.params.id;
  Order_detail.update(req.body, {
    where: { ord_mas_id: id },
  }).then((data) => {
    if (data[0] != 0) {
      Br_mat_sale.update(req.body, {
        where: { om_id: id },
      }).then((data) => {
        if (data[0] != 0) {
          res.status(200).send({
            message: "Order Detail was updated successfully",
          });
        } else {
          res.status(500).send({
            message: `Cannot update Order Detail with id=${id}`,
          });
        }
      });
    } else {
      res.status(500).send({
        message: `Cannot update Order Detail with id=${id}`,
      });
    }
  });
};

exports.delete = (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const Br_mat_sale = db1.br_mat_sale;

  const odid = req.params.odid;
  const omid = req.params.omid;

  Order_detail.findAll({
    where: { ord_mas_id: omid },
  })
    .then((data) => {
      if (data.length == 1) {
        res.status(502).send({
          message: `Sorry you cannot delete last detail of this other`,
        });
      } else {
        Order_detail.destroy({
          where: { od_id: odid },
        }).then((data) => {
          if (data) {
            Br_mat_sale.destroy({
              where: { od_id: odid },
            }).then((data) => {
              if (data) {
                res.status(200).send({
                  message: "order details was delete successfully!",
                });
              } else {
                res.status(500).send({
                  message: `Cannot delete Daily days with id=${id}`,
                });
              }
            });
          } else {
            res.status(500).send({
              message: `Cannot delete Order Detail with id=${odid}`,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occured while retrieving Order Detail",
      });
    });
};

exports.SubSaleReport = async (req, res) => {
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
  const Order_detail = db1.order_detail;

  if(req.body.sub_pro_id==undefined || req.body.dept_id==undefined || req.body.sub_pro_id=='' || req.body.dept_id=='')
  {
    res.status(422).send({
      message: "Department or Sub Product cannot be null",
    });
  }
  else
  {
    if(req.body.start != '' && req.body.end != '')
      {
        startdate=req.body.start+' 00:00:00.00 +00:00'
        enddate=req.body.end+' 23:59:59.00 +00:00'
        check = 
        {
          createdAt: 
          {
            [Op.between]: [startdate,enddate] 
          
          },
          dept_id:req.body.dept_id,
          sub_pro_id:req.body.sub_pro_id,
          status:1 
        }
      }
      else
      {
        check = 
        {
          dept_id:req.body.dept_id,
          sub_pro_id:req.body.sub_pro_id,
          status:1 
        }
      }
    Order_detail.findAll({
      where: check,
        include: [
          {
            model: db1.sub_products,
            as: 'sub_products',
            include: [
              {
                model: db1.products,
                as: 'products',
                attributes:['product_id','pro_name']
              }
            ]
      
          },
          {
            model: db.department_setup,
            as: 'br_sale_dept',
            attributes:['dept_id','dept_name']
          }
        ]
      
    })
      .then((data) => {
        if(!data.length)
          {
             res.status(422).send({
                     message: "Sorry! Data Not Found",
                });
          }
          else
          {
             res.status(200).send(data);
          }
      })
      .catch((err) => {
        res.status(502).send({
          message: "Error retrieving Sale Order Detail",
        });
      });
  }
};

exports.check_stock = async (req, res) => {
  const db1=req.ret_db
  const Order_detail = db1.order_detail;
  const deal_setup = db1.deal_setup;
  const Product_cost = db1.product_cost;
  const Br_grn_det = db1.br_grn_det;
  const Deal_item = db1.deal_item;

  const id = req.params.id;
  var data = await Order_detail.findByPk(id);//findone or findByPK return object
  var arr = [];
  var finalOutput = [];
  if(data.ds_id==null)
  {
    
    var data1 = await Product_cost.findAll({
      where: { sub_pro_id: data.sub_pro_id,status: 1 },
      include: [
        {
          model: db.raw_material,
          as: "raw_mat_cost",
        },
      ],
    });
  
    if (!data1.length) {
      res.status(202).send({
        message: "Sub product material detail not found",
      });
    } else {
      
      for (var det of data1) {
        var data2 = await Br_grn_det.findAll({
          where: {
            material_id: det.dataValues.material_id,
            dept_id: data.dept_id,
            status: 1,
          },
          attributes: [
            [sequelize.fn("SUM", sequelize.col("recv_unit_qty")), "recv_qty"],
            [
              sequelize.literal(
                `(Select price from br_grn_details where br_grn_details."material_id"=${det.dataValues.material_id} and "br_grn_details"."dept_id"=${data.dept_id} and br_grn_details.status=1 ORDER BY br_grn_details.br_grn_did DESC LIMIT 1 )`
              ),
              `pr`,
            ],
            [
              sequelize.literal(
                `(SELECT SUM("br_mat_sales"."so_unit_qty") from "br_mat_sales" where "br_mat_sales"."material_id"=${det.dataValues.material_id} and "br_mat_sales"."status"!=2 and "br_mat_sales"."dept_id"=${data.dept_id})`
              ),
              `so_qty`,
            ],
          ],
        });
        if (!data2.length) {
          res.status(500).send({
            message: "Data Not Found",
          });
        } else {
          var avlqty = parseFloat(data2[0].dataValues.recv_qty - data2[0].dataValues.so_qty).toFixed(2);
          var message;
          if (det.dataValues.unit_or_weight <= avlqty) {
            message = "Success";
          } else {
            message = "Error";
          }
          var obj = {
            material: det.dataValues.material_id,
            materialname: det.dataValues.raw_mat_cost.material_name,
            AvailQty: parseFloat(avlqty).toFixed(2),
            ReqQty: parseFloat(det.dataValues.unit_or_weight).toFixed(2),
            Message: message,
            rate: data2[0].dataValues.pr,
          };
          arr.push(obj);
        }
      }
      var flag = true;
      for (var array of arr) {
        if (array.Message == "Error") {
          flag = false;
        }
      }
  
      if (flag == false) {
        res.status(203).send({ data: arr });
      }
    }
  }
  else if(data.sub_pro_id==null)
  {
    var data1 = await deal_setup.findByPk(data.ds_id);
      const order_detail = {
        quantity: req.body.quantity,
        total: data1.price * req.body.quantity,
        net_total:data1.price * req.body.quantity,
      };
      var data2 = await Deal_item.findAll({
        where: { ds_id: data.ds_id,status: 1 },
      });
      if (!data2.length) {
        res.status(500).send({
          message: "Data Not Found",
        });
      } else {
        var arr2 = [];
        for (var det of data2) {
          var data6 = await deal_stock(
            det.dataValues.sub_pro_id,
            data.dept_id,
            det.dataValues.sub_qty,
            req
          );
          arr2.push(data6.res);
        }
        var tempOutput = [];
        for (var detarr of arr2) {
          for (var item of detarr) {
            var obj = {
              material: item.material,
              materialname: item.materialname,
              AvailQty: item.AvailQty,
              ReqQty: item.ReqQty,
              Message: item.Message,
              rate: item.rate,
            };
            tempOutput.push(obj);
          }
        }
       
        var index = 0;
        var newObj = {};
        for (var data7 of tempOutput) {
          if (finalOutput.some((item) => item.material === data7.material)) {
            index = finalOutput.findIndex((x) => x.material === data7.material);

            newObj = {
              material: data7.material,
              materialname: data7.materialname,
              AvailQty: data7.AvailQty,
              ReqQty: data7.ReqQty + finalOutput[index].ReqQty,
              Message: "",
              rate: data7.rate,
            };
            finalOutput[index] = newObj;
          } else {
            finalOutput.push(data7);
          }
        }
        for (var item of finalOutput) {
          var index = finalOutput.findIndex((x) => x.material === item.material);

          var message = "";
          if (item.AvailQty >= item.ReqQty) {
            message = "Succes";
          } else {
            message = "Error";
          }
          var newObj = {
            material: item.material,
            materialname: item.materialname,
            AvailQty: parseFloat(item.AvailQty).toFixed(2),
            ReqQty: parseFloat(item.ReqQty).toFixed(2),
            Message: message,
            rate: item.rate,
          };
          finalOutput[index] = newObj;
        }
        var flag = true;
        for (var newItem of finalOutput) {
          if(newItem.Message=="Error")
          {
            flag = false;
          }
        }
        if(flag== false)
          {
            res.status(203).send({"data":finalOutput});
          }        
      }
  }
};

exports.subpro_sale_graph = async (req, res) => {
  const deptid = req.body.dept_id;

  const sequelize = new Sequelize(req.ret_dbname, dbConfig.USER, dbConfig.PASSWORD, {
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

      if(req.body.dept_id== '')
      {
        query=`Select Sum(quantity),sub_products.sub_pro_id,sub_products.sub_pro_name,to_char(date("order_details"."createdAt"),'YYYY-MM') as year_month from order_details , sub_products where order_details.status=1
        and order_details.sub_pro_id=sub_products.sub_pro_id
        GROUP BY year_month,sub_products.sub_pro_id
        ORDER By sub_products.sub_pro_id`;
      }
      else
      {
        query=`Select Sum(quantity),sub_products.sub_pro_id,sub_products.sub_pro_name,to_char(date("order_details"."createdAt"),'YYYY-MM') as year_month from order_details , sub_products where order_details.status=1
        and order_details.sub_pro_id=sub_products.sub_pro_id
        and order_details.dept_id=${deptid}
        GROUP BY year_month,sub_products.sub_pro_id
        ORDER By sub_products.sub_pro_id`;
      }
      
      
      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      
      if(!result.length)
      {
        res.status(500).send({
                message: "Sorry! Data Not Found",
            }); 
      }
      else
      {
        res.status(200).send(result);
      }
};