//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_pr_master = sequelize.define("wh_pr_master", {
    wh_pr_mid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_pr_date: {
      type: Sequelize.STRING,
    },
    wh_purchase_term: {
      type: Sequelize.STRING,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    vendor_id: {
      type: Sequelize.INTEGER,
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    random_no: {
      type: Sequelize.STRING,
    },
    remarks: {
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
  return WH_pr_master;
};