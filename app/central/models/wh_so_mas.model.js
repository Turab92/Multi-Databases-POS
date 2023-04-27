module.exports = (sequelize, Sequelize) => {
  const WH_so_master = sequelize.define("wh_so_master", {
    wh_so_mid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    wh_so_date: {
      type: Sequelize.STRING,
    },
    br_pr_mid: {
      type: Sequelize.INTEGER,
    },
    so_purchase_term: {
      type: Sequelize.STRING,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    par_dept_id: {
      type: Sequelize.INTEGER,
    },
    client_id: {
      type: Sequelize.INTEGER,
    },
    order_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    random_no: {
      type: Sequelize.STRING,
    },
    so_remarks: {
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
  return WH_so_master;
};