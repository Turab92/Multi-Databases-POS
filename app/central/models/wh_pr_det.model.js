//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const WH_pr_detail = sequelize.define("wh_pr_detail", {
    wh_pr_did: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_pr_mid: {
      type: Sequelize.INTEGER,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    material_id: {
      type: Sequelize.INTEGER,
    },
    quantity: {
      type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return WH_pr_detail;
};