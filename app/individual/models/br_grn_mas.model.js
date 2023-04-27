

module.exports = (sequelize, Sequelize) => {
  const BR_grn_master = sequelize.define("br_grn_master", {
    br_grn_mid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    br_grn_date: {
      type: Sequelize.STRING,
    },
    wh_so_mid: {
      type: Sequelize.INTEGER,
    },
    br_po_mid: {
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
    br_grn_remarks: {
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
  return BR_grn_master;
};