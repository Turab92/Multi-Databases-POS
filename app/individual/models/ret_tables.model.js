const dbConfig = require("../../confiq/db.config");
const Sequelize = require("sequelize");
exports.getdb=(dbname)=>{
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


return db;
}