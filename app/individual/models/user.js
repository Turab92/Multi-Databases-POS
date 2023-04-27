const dbConfig = require("../../confiq/db.config");
const maindb = require("../../central/models/user");
const Sequelize = require("sequelize");
exports.getdb= (dbname)=>{
const sequelize = new Sequelize(dbname, dbConfig.USER, dbConfig.PASSWORD, {
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

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.products = require("../models/product.model.js")(sequelize, Sequelize);
db.sub_products = require("../models/sub_product.model.js")(sequelize, Sequelize);
db.customers = require("../models/customer.model.js")(sequelize, Sequelize);
db.order_type = require("../models/order_type.model.js")(sequelize, Sequelize);
db.pay_type = require("../models/pay_type.model.js")(sequelize, Sequelize);
db.ord_type_detail = require("../models/o_t_detail.model.js")(sequelize, Sequelize);
db.pay_type_detail = require("../models/pay_tp_detail.model.js")(sequelize, Sequelize);
db.order_master = require("../models/order_master.model.js")(sequelize, Sequelize);
db.order_detail = require("../models/order_detail.model.js")(sequelize, Sequelize);
db.deal_provider = require("../models/deal_provider.model.js")(sequelize, Sequelize);
db.deal_setup = require("../models/deal_setup.model.js")(sequelize, Sequelize);
db.deal_item = require("../models/deal_item.model.js")(sequelize, Sequelize);
db.discount = require("../models/discount.model.js")(sequelize, Sequelize);
db.product_cost = require("../models/prod_cost.model")(sequelize, Sequelize);
db.vendor_setup = require("../models/vendor_setup.model")(sequelize, Sequelize);
db.br_pr_mas = require("../models/br_pr_mas.model")(sequelize, Sequelize);
db.br_pr_det = require("../models/br_pr_det.model")(sequelize, Sequelize);
db.br_grn_mas = require("../models/br_grn_mas.model")(sequelize, Sequelize);
db.br_grn_det = require("../models/br_grn_det.model")(sequelize, Sequelize);
db.mat_rate_setup = require("../models/mat_rate_setup.model")(sequelize, Sequelize);
db.till_setup = require("../models/till_setup.model")(sequelize, Sequelize);
db.daily_days = require("../models/daily_days.model")(sequelize, Sequelize);
db.tax_type = require("../models/tax_type.model")(sequelize, Sequelize);
db.sales_return_setup = require("../models/sales_return_setup.model")(sequelize, Sequelize);
db.exchange_setup = require("../models/exchange_setup.model")(sequelize, Sequelize);
db.mart_ord_mas = require("../models/mart_ord_mas.model")(sequelize, Sequelize);
db.mart_ord_det = require("../models/mart_ord_det.model")(sequelize, Sequelize);
db.subpro_rate_setup = require("../models/subpro_rate_setup.model")(sequelize, Sequelize);
db.br_mat_sale = require("../models/br_mat_sale.model")(sequelize, Sequelize);
db.branch_product = require("../models/branch_prod.model")(sequelize, Sequelize);
db.banner = require("../models/banner.model")(sequelize, Sequelize);
db.online_ord_mas = require("../models/online_ord_mas.model")(sequelize, Sequelize);
db.online_ord_det = require("../models/online_ord_det.model")(sequelize, Sequelize);
db.areas = require("../models/areas.model")(sequelize, Sequelize);
db.br_po_mas = require("../models/br_po_mas.model")(sequelize, Sequelize);
db.br_po_det = require("../models/br_po_det.model")(sequelize, Sequelize);
db.add_to_cart = require("../models/add_to_cart.model")(sequelize, Sequelize);
db.customer_address = require("../models/customer_address.model")(sequelize, Sequelize);
db.deal_beverages = require("../models/deal_beverages.model")(sequelize, Sequelize);
db.printer_detail = require("../models/printer.model")(sequelize, Sequelize);
db.day_shifts = require("../models/day_shifts.model")(sequelize, Sequelize);
db.expense_type = require("../models/expense_type.model")(sequelize, Sequelize);
db.expense_setup = require("../models/expense_setup.model")(sequelize, Sequelize);
db.expense_out = require("../models/expense_out.model")(sequelize, Sequelize);
db.tax_calculation = require("../models/tax_calculation.model")(sequelize, Sequelize);
db.pnl = require("../models/pnl.model")(sequelize, Sequelize);
db.raw_mat_cat = require("../models/raw_mat_cat.model")(sequelize, Sequelize);
db.custom_sku = require("../models/custom_sku.model")(sequelize, Sequelize);
db.raw_mat_det = require("../models/raw_mat_det.model")(sequelize, Sequelize);
db.ret_expiry_setup = require("../models/ret_expiry_setup.model")(sequelize, Sequelize);

db.raw_mat_cat.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'mat_cat'
})

db.custom_sku.belongsTo(maindb.uom,{
  foreignKey: "uom_id",
  as:'custom_uom'
})
// maindb.raw_material.hasOne(db.raw_mat_cat,{
//   foreignKey: "material_id",
//   as:'mat_cat'
// })

db.sub_products.belongsTo(db.products,{
  foreignKey: "product_id",
  as:'products'
})
db.products.hasMany(db.sub_products,{
  foreignKey: "product_id",
  as:'products'
})

db.order_detail.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'sub_products'
})
db.sub_products.hasMany(db.order_detail,{
  foreignKey: "sub_pro_id",
  as:'sub_products'
})
db.order_detail.belongsTo(db.deal_setup,{
  foreignKey: "ds_id",
  as:'deal_setups'
})
db.deal_setup.hasMany(db.order_detail,{
  foreignKey: "ds_id",
  as:'deal_setups'
})

db.order_master.belongsTo(db.customers,{
  foreignKey: "cus_id",
  as:'customers'
})
db.customers.hasOne(db.order_master,{
  foreignKey: "cus_id",
  as:'customers'
})


db.mart_ord_mas.belongsTo(db.customers,{
  foreignKey: "cus_id",
  as:'mart_customers'
})
db.customers.hasOne(db.mart_ord_mas,{
  foreignKey: "cus_id",
  as:'mart_customers'
})

db.order_master.belongsTo(db.ord_type_detail,{
  foreignKey: "ot_de_id",
  as:'ot_details'
})
// db.ord_type_detail.hasOne(db.order_master,{
//   foreignKey: "ot_d_id",
//   as:'ot_details'
// })
db.mart_ord_mas.belongsTo(db.ord_type_detail,{
  foreignKey: "ot_de_id",
  as:'m_ot_details'
})
db.ord_type_detail.hasOne(db.mart_ord_mas,{
  foreignKey: "ot_de_id",
  as:'m_ot_details'
})


db.order_master.belongsTo(db.pay_type_detail,{
  foreignKey: "pt_de_id",
  as:'pt_details'
})
// db.pay_type_detail.hasOne(db.order_master,{
//   foreignKey: "pt_d_id",
//   as:'pt_details'
// })
db.mart_ord_mas.belongsTo(db.pay_type_detail,{
  foreignKey: "pt_de_id",
  as:'mart_pt_details'
})
db.pay_type_detail.hasOne(db.mart_ord_mas,{
  foreignKey: "pt_de_id",
  as:'mart_pt_details'
})

db.order_detail.belongsTo(db.order_master,{
  foreignKey: "ord_mas_id",
  as:'ord_detail'
})
db.order_master.hasMany(db.order_detail,{
  foreignKey: "ord_mas_id",
  as:'ord_detail'
})

db.mart_ord_det.belongsTo(db.mart_ord_mas,{
  foreignKey: "m_om_id",
  as:'mart_ord_detail'
})
db.mart_ord_mas.hasMany(db.mart_ord_det,{
  foreignKey: "m_om_id",
  as:'mart_ord_detail'
})

db.deal_setup.belongsTo(db.deal_provider,{
  foreignKey: "dp_id",
  as:'dp'
})
db.deal_provider.hasMany(db.deal_setup,{
  foreignKey: "dp_id",
  as:'dp'
})
db.deal_item.belongsTo(db.deal_setup,{
  foreignKey: "ds_id",
  as:'ds'
})
db.deal_setup.hasMany(db.deal_item,{
  foreignKey: "ds_id",
  as:'ds'
})
db.deal_item.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'sub'
})
db.sub_products.hasMany(db.deal_item,{
  foreignKey: "sub_pro_id",
  as:'sub'
})
db.deal_item.belongsTo(db.deal_provider,{
  foreignKey: "dp_id",
  as:'dp_item'
})
db.deal_provider.hasMany(db.deal_item,{
  foreignKey: "dp_id",
  as:'dp_item'
})

db.product_cost.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'raw_mat_cost'
})
// maindb.raw_material.hasMany(db.product_cost,{
//   foreignKey: "material_id",
//   as:'raw_mat_cost'
// })
db.product_cost.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'subpro'
})
db.sub_products.hasMany(db.product_cost,{
  foreignKey: "sub_pro_id",
  as:'subpro'
})
db.subpro_rate_setup.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'subpro_rate'
})
db.sub_products.hasMany(db.subpro_rate_setup,{
  foreignKey: "sub_pro_id",
  as:'subpro_rate'
})
db.mat_rate_setup.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'mat'
})
// maindb.raw_material.hasMany(db.mat_rate_setup,{
//   foreignKey: "material_id",
//   as:'mat'
// })
db.br_pr_det.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'br_pr_mat'
})
// maindb.raw_material.hasMany(db.br_pr_det,{
//   foreignKey: "material_id",
//   as:'br_pr_mat'
// })
db.br_grn_det.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'br_grn_mat'
})
// maindb.raw_material.hasMany(db.br_grn_det,{
//   foreignKey: "material_id",
//   as:'br_grn_mat'
// })
db.br_pr_det.belongsTo(db.br_pr_mas,{
  foreignKey: "br_pr_mid",
  as:'br_pr_det'
})
db.br_pr_mas.hasMany(db.br_pr_det,{
  foreignKey: "br_pr_mid",
  as:'br_pr_det'
})
db.br_pr_mas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'requested_dept'
})
// maindb.department_setup.hasMany(db.br_pr_mas,{
//   foreignKey: "dept_id",
//   as:'requested_dept'
// })

db.br_po_det.belongsTo(db.br_po_mas,{
  foreignKey: "br_po_mid",
  as:'br_po_det'
})
db.br_po_mas.hasMany(db.br_po_det,{
  foreignKey: "br_po_mid",
  as:'br_po_det'
})
db.br_po_mas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_po_dept'
})
// maindb.department_setup.hasMany(db.br_po_mas,{
//   foreignKey: "dept_id",
//   as:'br_po_dept'
// })
db.daily_days.belongsTo(db.till_setup,{
  foreignKey: "till_id",
  as:'till_setup'
})
db.till_setup.hasOne(db.daily_days,{
  foreignKey: "till_id",
  as:'till_setup'
})
db.mart_ord_det.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'ord_raw'
})
// maindb.raw_material.hasMany(db.mart_ord_det,{
//   foreignKey: "material_id",
//   as:'ord_raw'
// })
db.mart_ord_det.belongsTo(db.raw_mat_cat,{
  foreignKey: "mat_cat_id",
  as:'ord_mat_cat'
})
db.raw_mat_cat.hasMany(db.mart_ord_det,{
  foreignKey: "mat_cat_id",
  as:'ord_mat_cat'
})
db.till_setup.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'till_depart'
})
// maindb.department_setup.hasOne(db.till_setup,{
//   foreignKey: "dept_id",
//   as:'till_depart'
// })
db.mart_ord_mas.belongsTo(db.daily_days,{
  foreignKey: "day_id",
  as:'day'
})
db.daily_days.hasOne(db.mart_ord_mas,{
  foreignKey: "day_id",
  as:'day'
})

db.branch_product.belongsTo(db.products,{
  foreignKey: "product_id",
  as:'br_pro'
})
db.products.hasOne(db.branch_product,{
  foreignKey: "product_id",
  as:'br_pro'
})
db.branch_product.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'br_sub'
})
db.sub_products.hasOne(db.branch_product,{
  foreignKey: "sub_pro_id",
  as:'br_sub'
})
db.branch_product.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_dept'
})
// maindb.department_setup.hasMany(db.branch_product,{
//   foreignKey: "dept_id",
//   as:'br_dept'
// })

db.banner.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'banner_dept'
})
// maindb.department_setup.hasMany(db.banner,{
//   foreignKey: "dept_id",
//   as:'banner_dept'
// })

db.banner.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'banner_sub'
})
db.sub_products.hasMany(db.banner,{
  foreignKey: "sub_pro_id",
  as:'banner_sub'
})
db.areas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
 as:'br_area'
})
// maindb.department_setup.hasMany(db.areas,{
//   foreignKey: "dept_id",
//   as:'br_area'
// })

db.br_po_det.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'br_po_mat'
})
// maindb.raw_material.hasMany(db.br_po_det,{
//   foreignKey: "material_id",
//   as:'br_po_mat'
// })

db.deal_item.belongsTo(db.branch_product,{
  foreignKey: "sub_pro_id",
  as:'sub_deal'
})
db.branch_product.hasMany(db.deal_item,{
  foreignKey: "sub_pro_id",
  as:'sub_deal'
})
//check this
// maindb.wh_po_mas.belongsTo(db.vendor_setup,{
//   foreignKey: "vendor_id",
//   as:'wh_po_vendor'
// })
// db.vendor_setup.hasMany(maindb.wh_po_mas,{
//   foreignKey: "vendor_id",
//   as:'wh_po_vendor'
// })
//

db.br_pr_mas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_pr_dept'
})
// maindb.department_setup.hasMany(db.br_pr_mas,{
//   foreignKey: "dept_id",
//   as:'br_pr_dept'
// })
db.br_pr_mas.belongsTo(maindb.department_setup,{
  foreignKey: "parent_dept_id",
  as:'br_pr_par_dept'
})
db.br_pr_mas.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'br_pr_user'
})
// maindb.users.hasMany(db.br_pr_mas,{
//   foreignKey: "user_id",
//   as:'br_pr_user'
// })

db.br_po_mas.belongsTo(db.vendor_setup,{
  foreignKey: "vendor_id",
  as:'br_po_vendor'
})
db.vendor_setup.hasMany(db.br_po_mas,{
  foreignKey: "vendor_id",
  as:'br_po_vendor'
})
db.br_po_mas.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'br_po_user'
})
// maindb.users.hasMany(db.br_po_mas,{
//   foreignKey: "user_id",
//   as:'br_po_user'
// })

db.br_grn_det.belongsTo(db.br_grn_mas,{
  foreignKey: "br_grn_mid",
  as:'br_grn_det'
})
db.br_grn_mas.hasMany(db.br_grn_det,{
  foreignKey: "br_grn_mid",
  as:'br_grn_det'
})
db.br_grn_mas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_grn_dept'
})
// maindb.department_setup.hasMany(db.br_grn_mas,{
//   foreignKey: "dept_id",
//   as:'br_grn_dept'
// })
db.br_grn_mas.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'br_grn_user'
})
// maindb.users.hasMany(db.br_grn_mas,{
//   foreignKey: "user_id",
//   as:'br_grn_user'
// })
db.order_master.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_so_dept'
})
// maindb.department_setup.hasMany(db.order_master,{
//   foreignKey: "dept_id",
//   as:'br_so_dept'
// })
db.order_master.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'br_so_user'
})


db.mart_ord_mas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_so_mart_dept'
})
db.mart_ord_mas.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'br_so_mart_user'
})
// maindb.users.hasMany(db.order_master,{
//   foreignKey: "user_id",
//   as:'br_so_user'
// })

db.br_mat_sale.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'br_so_mat'
})
// maindb.raw_material.hasMany(db.br_mat_sale,{
//   foreignKey: "material_id",
//   as:'br_so_mat'
// })
db.br_mat_sale.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_sale_mat_dept'
})
// maindb.department_setup.hasMany(db.br_mat_sale,{
//   foreignKey: "dept_id",
//   as:'br_sale_mat_dept'
// })
db.br_mat_sale.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'br_so_sub'
})
db.sub_products.hasMany(db.br_mat_sale,{
  foreignKey: "sub_pro_id",
  as:'br_so_sub'
})
db.br_mat_sale.belongsTo(db.deal_setup,{
  foreignKey: "ds_id",
  as:'br_so_deal'
})
db.deal_setup.hasMany(db.br_mat_sale,{
  foreignKey: "ds_id",
  as:'br_so_deal'
})
db.order_detail.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'br_sale_dept'
})
// maindb.department_setup.hasMany(db.order_detail,{
//   foreignKey: "dept_id",
//   as:'br_sale_dept'
// })

db.daily_days.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dd_dept'
})
// maindb.department_setup.hasMany(db.daily_days,{
//   foreignKey: "dept_id",
//   as:'dd_dept'
// })
db.daily_days.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'dd_user'
})
// maindb.users.hasMany(db.daily_days,{
//   foreignKey: "user_id",
//   as:'dd_user'
// })

db.online_ord_mas.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'online_dept'
})
// maindb.department_setup.hasMany(db.online_ord_mas,{
//   foreignKey: "dept_id",
//   as:'online_dept'
// })
db.online_ord_mas.belongsTo(db.ord_type_detail,{
  foreignKey: "ot_de_id",
  as:'online_otd'
})
db.ord_type_detail.hasOne(db.online_ord_mas,{
  foreignKey: "ot_de_id",
  as:'online_otd'
})
db.online_ord_mas.belongsTo(db.customers,{
  foreignKey: "cus_id",
  as:'online_customer'
})
db.customers.hasOne(db.online_ord_mas,{
  foreignKey: "cus_id",
  as:'online_customer'
})
db.online_ord_det.belongsTo(db.online_ord_mas,{
  foreignKey: "on_om_id",
  as:'online_ord_det'
})
db.online_ord_mas.hasMany(db.online_ord_det,{
  foreignKey: "on_om_id",
  as:'online_ord_det'
})

db.ord_type_detail.belongsTo(db.order_type,{
  foreignKey: "ord_type_id",
  as:'online_ord_type'
})
db.order_type.hasOne(db.ord_type_detail,{
  foreignKey: "ord_type_id",
  as:'online_ord_type'
})
db.online_ord_det.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'online_sub'
})
db.sub_products.hasOne(db.online_ord_det,{
  foreignKey: "sub_pro_id",
  as:'online_sub'
})
db.online_ord_det.belongsTo(db.deal_setup,{
  foreignKey: "ds_id",
  as:'online_deal'
})
db.deal_setup.hasOne(db.online_ord_det,{
  foreignKey: "ds_id",
  as:'online_deal'
})

db.deal_beverages.belongsTo(db.deal_setup,{
  foreignKey: "ds_id",
  as:'deal_bev'
})
db.deal_setup.hasOne(db.deal_beverages,{
  foreignKey: "ds_id",
  as:'deal_bev'
})
db.deal_beverages.belongsTo(db.sub_products,{
  foreignKey: "sub_pro_id",
  as:'deal_bev_sub'
})
db.sub_products.hasOne(db.deal_beverages,{
  foreignKey: "sub_pro_id",
  as:'deal_bev_sub'
})
db.printer_detail.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_printer'
})
// maindb.department_setup.hasMany(db.printer_detail,{
//   foreignKey: "dept_id",
//   as:'dept_printer'
// })
db.printer_detail.belongsTo(db.till_setup,{
  foreignKey: "till_id",
  as:'till_print'
})
db.till_setup.hasMany(db.printer_detail,{
  foreignKey: "till_id",
  as:'till_print'
})

db.day_shifts.belongsTo(db.daily_days,{
  foreignKey: "day_id",
  as:'all_shifts'
})
db.daily_days.hasMany(db.day_shifts,{
  foreignKey: "day_id",
  as:'all_shifts'
})
db.expense_setup.belongsTo(db.expense_type,{
  foreignKey: "exp_type_id",
  as:'exp_type'
})
db.expense_type.hasMany(db.expense_setup,{
  foreignKey: "exp_type_id",
  as:'exp_type'
})
db.mart_ord_mas.belongsTo(db.day_shifts,{
  foreignKey: "shift_id",
  as:'mas_shift'
})
db.day_shifts.hasMany(db.mart_ord_mas,{
  foreignKey: "shift_id",
  as:'mas_shift'
})

db.expense_setup.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_exp_gen'
})
// maindb.department_setup.hasMany(db.expense_setup,{
//   foreignKey: "dept_id",
//   as:'dept_exp_gen'
// })

db.expense_out.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_exp_out'
})
// maindb.department_setup.hasMany(db.expense_out,{
//   foreignKey: "dept_id",
//   as:'dept_exp_out'
// })
db.expense_out.belongsTo(db.expense_setup,{
  foreignKey: "expense_id",
  as:'exp_out'
})
db.expense_setup.hasMany(db.expense_out,{
  foreignKey: "expense_id",
  as:'exp_out'
})

db.tax_calculation.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_tax_cal'
})
// maindb.department_setup.hasMany(db.tax_calculation,{
//   foreignKey: "dept_id",
//   as:'dept_tax_cal'
// })

db.pnl.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_pnl'
})
// maindb.department_setup.hasMany(db.pnl,{
//   foreignKey: "dept_id",
//   as:'dept_pnl'
// })
db.pnl.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'created_by_pnl'
})

db.sales_return_setup.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'return_ord_raw'
})
db.sales_return_setup.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'return_user'
})

db.sales_return_setup.belongsTo(db.raw_mat_cat,{
  foreignKey: "mat_cat_id",
  as:'return_ord_mat_cat'
})
db.raw_mat_cat.hasMany(db.sales_return_setup,{
  foreignKey: "mat_cat_id",
  as:'return_ord_mat_cat'
})
db.sales_return_setup.belongsTo(db.mart_ord_det,{
  foreignKey: "m_od_id",
  as:'return_ord_detail'
})
db.mart_ord_det.hasMany(db.sales_return_setup,{
  foreignKey: "m_od_id",
  as:'return_ord_detail'
})

db.mart_ord_det.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_ord_det'
})

db.exchange_setup.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'exchange_ord_raw'
})
db.exchange_setup.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'exchange_user'
})

db.expense_setup.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'expense_user'
})

db.expense_out.belongsTo(maindb.users,{
  foreignKey: "user_id",
  as:'expense_out_user'
})

db.exchange_setup.belongsTo(db.raw_mat_cat,{
  foreignKey: "mat_cat_id",
  as:'exchange_ord_mat_cat'
})
db.raw_mat_cat.hasMany(db.exchange_setup,{
  foreignKey: "mat_cat_id",
  as:'exchange_ord_mat_cat'
})
db.exchange_setup.belongsTo(db.mart_ord_det,{
  foreignKey: "m_od_id",
  as:'exchange_ord_detail'
})
db.mart_ord_det.hasMany(db.exchange_setup,{
  foreignKey: "m_od_id",
  as:'exchange_ord_detail'
})

db.sales_return_setup.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_return'
})
db.exchange_setup.belongsTo(maindb.department_setup,{
  foreignKey: "dept_id",
  as:'dept_exchange'
})

db.raw_mat_det.belongsTo(maindb.raw_material,{
  foreignKey: "mat_mas_id",
  as:'raw_det_mas'
})
db.raw_mat_det.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'raw_det_mat'
})
db.ret_expiry_setup.belongsTo(maindb.raw_material,{
  foreignKey: "material_id",
  as:'ret_exp'
})


return db;
}