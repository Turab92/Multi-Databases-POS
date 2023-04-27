module.exports = (sequelize, Sequelize) => {
  const BR_pr_master = sequelize.define("br_pr_master", {
    br_pr_mid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    br_pr_date: {
      type: Sequelize.STRING,
    },
    br_purchase_term: {
      type: Sequelize.STRING,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    parent_dept_id: {
      type: Sequelize.INTEGER,
    },
    total_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    random_no: {
      type: Sequelize.STRING,
    },
    br_pr_remarks: {
        type: Sequelize.STRING,
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    provider: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return BR_pr_master;
};