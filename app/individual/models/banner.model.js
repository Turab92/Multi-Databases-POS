module.exports = (sequelize, Sequelize) => {
    const Banner = sequelize.define("banner", {
      banner_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      sub_pro_id: {
        type: Sequelize.INTEGER,
      },
      priority: {
        type: Sequelize.INTEGER,
      },
      banner_validity: {
        type: Sequelize.STRING,
      },
      start_time: {
        type: Sequelize.STRING,
      },
      end_time: {
        type: Sequelize.STRING,
      },
      app_banner_image: {
        type: Sequelize.STRING,
      },
      web_banner_image:{
          type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Banner;
  };