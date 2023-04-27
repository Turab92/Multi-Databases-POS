//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_so_detail = sequelize.define("wh_so_detail", {
    wh_so_did: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_so_mid: {
      type: Sequelize.INTEGER,
    },
    par_dept_id: {
      type: Sequelize.INTEGER,
    },
    material_id: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
    },
    req_unit_qty: {
      type: Sequelize.DECIMAL(10, 2),
    },
    so_unit_qty: {
      type: Sequelize.DECIMAL(10, 2),
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return WH_so_detail;
};