//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_grn_detail = sequelize.define("wh_grn_detail", {
    wh_grn_did: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_grn_mid: {
      type: Sequelize.INTEGER,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    material_id: {
      type: Sequelize.INTEGER,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
    },
    ord_unit_qty: {
      type: Sequelize.DECIMAL(10, 2),
    },
    recv_unit_qty: {
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
  return WH_grn_detail;
};