module.exports = (sequelize, Sequelize) => {
    const Wh_mat_rate = sequelize.define("wh_mat_rate", {
      wh_mat_rate_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      material_id: {
        type: Sequelize.INTEGER,
      },
      mat_current_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      mat_set_profit_rate: {
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
    return Wh_mat_rate;
  };