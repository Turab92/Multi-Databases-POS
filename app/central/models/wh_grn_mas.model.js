//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_grn_master = sequelize.define("wh_grn_master", {
    wh_grn_mid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_grn_date: {
      type: Sequelize.STRING,
    },
    wh_po_mid: {
      type: Sequelize.INTEGER,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    order_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    random_no: {
      type: Sequelize.STRING,
    },
    grn_remarks: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return WH_grn_master;
};