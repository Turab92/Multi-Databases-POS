module.exports = (sequelize, Sequelize) => {
    const Subpro_rate_setup = sequelize.define("subpro_rate_setup", {
      sp_rate_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      sub_pro_id: {
        type: Sequelize.INTEGER,
      },
      est_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      net_rate: {
        type: Sequelize.DECIMAL(10, 2),
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Subpro_rate_setup;
  };