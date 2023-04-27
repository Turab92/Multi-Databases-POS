module.exports = (sequelize, Sequelize) => {
    const Comp_detail = sequelize.define("comp_detail", {
      comp_detail_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      comp_email:{
        type: Sequelize.STRING,
      },
      comp_link:{
          type: Sequelize.STRING,
      },
      comp_logo: {
        type: Sequelize.STRING,
      },
      comp_favicon: {
        type: Sequelize.STRING,
      },
      comp_description:{
          type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Comp_detail;
  };