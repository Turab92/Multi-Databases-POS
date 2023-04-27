module.exports = (sequelize, Sequelize) => {
  const Mat_rate_setup = sequelize.define("mat_rate_setup", {
    mat_rate_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    material_id: {
      type: Sequelize.INTEGER,
    },
    mat_current_rate: {
      type: Sequelize.DECIMAL(10, 2),
    },
    mat_purchase_rate: {
      type: Sequelize.DECIMAL(10, 2),
    },
    user_id: {
    type: Sequelize.INTEGER,
    },  
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Mat_rate_setup;
};