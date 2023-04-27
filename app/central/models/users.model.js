//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    user_name: {
      type: Sequelize.STRING,
    },
    user_email: {
      type: Sequelize.STRING,
    },
    user_pass: {
      type: Sequelize.STRING,
    },
    user_phone: {
      type: Sequelize.STRING,
    },
    role_id: {
      type: Sequelize.INTEGER,
    },
    dept_id: {
      type: Sequelize.INTEGER,
    },
    is_retailer: {
      type: Sequelize.INTEGER,
    },
    is_registered: {
      type: Sequelize.INTEGER,
    },
    retailer_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return User;
};