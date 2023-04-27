//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_po_master = sequelize.define("wh_po_master", {
    wh_po_mid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_po_date: {
      type: Sequelize.STRING,
    },
    wh_pr_mid: {
      type: Sequelize.INTEGER,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    wh_purchase_term: {
      type: Sequelize.STRING,
    },
    vendor_id: {
      type: Sequelize.INTEGER,
    },
    order_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    random_no: {
      type: Sequelize.STRING,
    },
    po_remarks: {
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
  return WH_po_master;
};