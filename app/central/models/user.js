const dbConfig = require("../../confiq/db.config");

const Sequelize = require("sequelize");

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
sequelize.dialect.supports.schemas = true;
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//db.notes = require("./notes.model.js")(sequelize, Sequelize);
db.users = require("./users.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.mainmenu = require("../models/mainmenu.model.js")(sequelize, Sequelize);
db.submenu = require("../models/submenu.model.js")(sequelize, Sequelize);
db.sessions = require("../models/session.model.js")(sequelize, Sequelize);
db.raw_material = require("../models/raw_material.model.js")(sequelize, Sequelize);
db.uom = require("../models/uom.model.js")(sequelize, Sequelize);
db.role_permission = require("../models/role_permission.model")(sequelize, Sequelize);
db.wh_pr_mas = require("../models/wh_pr_mas.model")(sequelize, Sequelize);
db.wh_pr_det = require("../models/wh_pr_det.model")(sequelize, Sequelize);
db.wh_po_mas = require("../models/wh_po_mas.model")(sequelize, Sequelize);
db.wh_po_det = require("../models/wh_po_det.model")(sequelize, Sequelize);
db.wh_grn_mas = require("../models/wh_grn_mas.model")(sequelize, Sequelize);
db.wh_grn_det = require("../models/wh_grn_det.model")(sequelize, Sequelize);
db.wh_so_mas = require("../models/wh_so_mas.model")(sequelize, Sequelize);
db.wh_so_det = require("../models/wh_so_det.model")(sequelize, Sequelize);
db.department_setup = require("./department_setup.model")(sequelize, Sequelize);
db.dept_type = require("../models/dept_type.model")(sequelize, Sequelize);
db.wh_mat_rate = require("../models/wh_mat_rate.model")(sequelize, Sequelize);
db.client = require("../models/client.model")(sequelize, Sequelize);
db.retailer = require("../models/retailer.model")(sequelize, Sequelize);
db.apk_details = require("../models/apk.model")(sequelize, Sequelize);
db.wh_vendor_setup = require("../models/wh_vendor.model")(sequelize, Sequelize);
db.comp_detail = require("../models/comp_detail.model")(sequelize, Sequelize);

db.wh_po_mas.belongsTo(db.wh_vendor_setup,{
  foreignKey: "vendor_id",
  as:'wh_vendor'
})
db.wh_vendor_setup.hasMany(db.wh_po_mas,{
  foreignKey: "vendor_id",
  as:'wh_vendor'
})

db.users.belongsTo(db.role,{
  foreignKey: "role_id",
  as:'roles'
})
db.role.hasOne(db.users,{
  foreignKey: "role_id",
  as:'roles'
})

db.role_permission.belongsTo(db.mainmenu,{
  foreignKey: "main_id",
  as:'main'
})
db.mainmenu.hasOne(db.role_permission,{
  foreignKey: "main_id",
  as:'main'
})
db.role_permission.belongsTo(db.submenu,{
  foreignKey: "sub_id",
  as:'sub'
})
db.submenu.hasOne(db.role_permission,{
  foreignKey: "sub_id",
  as:'sub'
})
db.role_permission.belongsTo(db.role,{
  foreignKey: "role_id",
  as:'role'
})
db.role.hasMany(db.role_permission,{
  foreignKey: "role_id",
  as:'role'
})
db.raw_material.belongsTo(db.uom,{
  foreignKey: "uom_id",
  as:'uom'
})
db.uom.hasMany(db.raw_material,{
  foreignKey: "uom_id",
  as:'uom'
})
db.wh_pr_det.belongsTo(db.raw_material,{
  foreignKey: "material_id",
  as:'pr_mat'
})
db.raw_material.hasMany(db.wh_pr_det,{
  foreignKey: "material_id",
  as:'pr_mat'
})
db.wh_po_det.belongsTo(db.raw_material,{
  foreignKey: "material_id",
  as:'po_mat'
})
db.raw_material.hasMany(db.wh_po_det,{
  foreignKey: "material_id",
  as:'po_mat'
})
db.wh_grn_det.belongsTo(db.raw_material,{
  foreignKey: "material_id",
  as:'grn_mat'
})
db.raw_material.hasMany(db.wh_grn_det,{
  foreignKey: "material_id",
  as:'grn_mat'
})
db.wh_so_det.belongsTo(db.raw_material,{
  foreignKey: "material_id",
  as:'so_mat'
})
db.raw_material.hasMany(db.wh_so_det,{
  foreignKey: "material_id",
  as:'so_mat'
})
db.wh_po_mas.belongsTo(db.wh_pr_mas,{
  foreignKey: "wh_pr_mid",
  as:'wh_pr'
})
db.wh_pr_mas.hasMany(db.wh_po_mas,{
  foreignKey: "wh_pr_mid",
  as:'wh_pr'
})
db.wh_pr_det.belongsTo(db.wh_pr_mas,{
  foreignKey: "wh_pr_mid",
  as:'wh_pr_det'
})
db.wh_pr_mas.hasMany(db.wh_pr_det,{
  foreignKey: "wh_pr_mid",
  as:'wh_pr_det'
})
db.wh_so_det.belongsTo(db.wh_so_mas,{
  foreignKey: "wh_so_mid",
  as:'wh_so_det'
})
db.wh_so_mas.hasMany(db.wh_so_det,{
  foreignKey: "wh_so_mid",
  as:'wh_so_det'
})
db.wh_so_mas.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'so_dept'
})
db.department_setup.hasMany(db.wh_so_mas,{
  foreignKey: "dept_id",
  as:'so_dept'
})
db.department_setup.belongsTo(db.dept_type,{
  foreignKey: "dept_type_id",
  as:'dept_type'
})
db.dept_type.hasMany(db.department_setup,{
  foreignKey: "dept_type_id",
  as:'dept_type'
})
db.department_setup.belongsTo(db.department_setup,{
  foreignKey: "parent_dept_id",
  as:'parent_dept'
})
db.users.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'depart'
})
db.department_setup.hasOne(db.users,{
  foreignKey: "dept_id",
  as:'depart'
})

db.wh_pr_mas.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'wh_pr_dept'
})
db.department_setup.hasMany(db.wh_pr_mas,{
  foreignKey: "dept_id",
  as:'wh_pr_dept'
})
db.wh_pr_mas.belongsTo(db.users,{
  foreignKey: "user_id",
  as:'wh_pr_user'
})
db.users.hasMany(db.wh_pr_mas,{
  foreignKey: "user_id",
  as:'wh_pr_user'
})

db.wh_po_det.belongsTo(db.wh_po_mas,{
  foreignKey: "wh_po_mid",
  as:'wh_po_det'
})
db.wh_po_mas.hasMany(db.wh_po_det,{
  foreignKey: "wh_po_mid",
  as:'wh_po_det'
})
db.wh_po_mas.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'wh_po_dept'
})
db.department_setup.hasMany(db.wh_po_mas,{
  foreignKey: "dept_id",
  as:'wh_po_dept'
})
db.wh_po_mas.belongsTo(db.users,{
  foreignKey: "user_id",
  as:'wh_po_user'
})
db.users.hasMany(db.wh_po_mas,{
  foreignKey: "user_id",
  as:'wh_po_user'
})

db.wh_grn_det.belongsTo(db.wh_grn_mas,{
  foreignKey: "wh_grn_mid",
  as:'wh_grn_det'
})
db.wh_grn_mas.hasMany(db.wh_grn_det,{
  foreignKey: "wh_grn_mid",
  as:'wh_grn_det'
})
db.wh_grn_mas.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'wh_grn_dept'
})
db.department_setup.hasMany(db.wh_grn_mas,{
  foreignKey: "dept_id",
  as:'wh_grn_dept'
})
db.wh_grn_mas.belongsTo(db.users,{
  foreignKey: "user_id",
  as:'wh_grn_user'
})
db.users.hasMany(db.wh_grn_mas,{
  foreignKey: "user_id",
  as:'wh_grn_user'
})
db.wh_so_mas.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'wh_so_dept'
})
db.department_setup.hasMany(db.wh_so_mas,{
  foreignKey: "dept_id",
  as:'wh_so_dept'
})
db.wh_so_mas.belongsTo(db.department_setup,{
  foreignKey: "par_dept_id",
  as:'wh_so_par_dept'
})
db.wh_so_mas.belongsTo(db.users,{
  foreignKey: "user_id",
  as:'wh_so_user'
})
db.users.hasMany(db.wh_so_mas,{
  foreignKey: "user_id",
  as:'wh_so_user'
})

db.wh_grn_det.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'wh_grn_der_dept'
})
db.department_setup.hasMany(db.wh_grn_det,{
  foreignKey: "dept_id",
  as:'wh_grn_der_dept'
})
db.wh_so_det.belongsTo(db.department_setup,{
  foreignKey: "par_dept_id",
  as:'wh_so_det_dept'
})

db.wh_mat_rate.belongsTo(db.department_setup,{
  foreignKey: "dept_id",
  as:'wh_rate_dept'
})
db.department_setup.hasMany(db.wh_mat_rate,{
  foreignKey: "dept_id",
  as:'wh_rate_dept'
})
db.wh_mat_rate.belongsTo(db.raw_material,{
  foreignKey: "material_id",
  as:'wh_raw_rate'
})
db.raw_material.hasMany(db.wh_mat_rate,{
  foreignKey: "material_id",
  as:'wh_raw_rate'
})

db.raw_material.belongsTo(db.retailer,{
  foreignKey: "retailer_id",
  as:'retailer_raw'
})
db.retailer.hasMany(db.raw_material,{
  foreignKey: "retailer_id",
  as:'retailer_raw'
})

// db.products.hasMany(db.sub_products);
// db.sub_products.hasOne(db.products);
// db.sub_products.associate = function(models) {
//   db.sub_products.hasOne(models.products, { foreignKey: 'product_id', as:'products' });
// };
//  db.products.associate = function(models) {
//     db.products.hasMany(models.sub_products, { foreignKey: 'product_id', as:'products' });
//   };
//db.ROLES = ["user", "admin", "moderator"];

module.exports = db;