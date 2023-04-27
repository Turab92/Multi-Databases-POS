

module.exports = (sequelize, Sequelize) => {
  const BR_pr_detail = sequelize.define("br_pr_detail", {
    br_pr_did: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    br_pr_mid: {
      type: Sequelize.INTEGER,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    material_id: {
      type: Sequelize.INTEGER,
    },
    br_qty: {
      type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return BR_pr_detail;
};