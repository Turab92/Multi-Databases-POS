module.exports = (sequelize, Sequelize) => {
    const Return_expiry_setup = sequelize.define("return_expiry_setup", {
      ret_exp_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      material_id: {
        type: Sequelize.INTEGER,
      },
      return_days: {
        type: Sequelize.INTEGER,
      },
      user_id:{
          type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Return_expiry_setup;
  };