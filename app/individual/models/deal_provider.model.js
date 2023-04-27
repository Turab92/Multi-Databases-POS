

module.exports = (sequelize, Sequelize) => {
  const Deal_provider = sequelize.define("deal_provider", {
    dp_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    dp_name: {
      type: Sequelize.STRING,
    },
    dp_disc: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    web_app_status: {
      type: Sequelize.INTEGER,
    }
  }
  );
  return Deal_provider;
};