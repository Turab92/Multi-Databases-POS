module.exports = (sequelize, Sequelize) => {
    const Till_setup = sequelize.define("till_setup", {
      till_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      till_name: {
        type: Sequelize.STRING,
      },
      pc_name: {
        type: Sequelize.STRING,
      },
      mac_address: {
        type: Sequelize.STRING,
      },
      ip_address: {
        type: Sequelize.STRING,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      is_active: {
        type: Sequelize.INTEGER,
        defaultValue:0
        },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Till_setup;
  };