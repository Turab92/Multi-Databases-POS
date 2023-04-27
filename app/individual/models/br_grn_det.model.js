

module.exports = (sequelize, Sequelize) => {
  const BR_grn_detail = sequelize.define("br_grn_detail", {
    br_grn_did: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    br_grn_mid: {
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
  return BR_grn_detail;
};