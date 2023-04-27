//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_po_detail = sequelize.define("wh_po_detail", {
    wh_po_did: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_po_mid: {
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
    req_unit_qty: {
      type: Sequelize.DECIMAL(10, 2),
    },
    po_unit_qty: {
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
  return WH_po_detail;
};