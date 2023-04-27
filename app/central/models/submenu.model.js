//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const Submenu = sequelize.define("submenus", {
    sub_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    main_id: {
      type: Sequelize.INTEGER,
    },  
    sub_title: {
      type: Sequelize.STRING,
    },
    sub_link: {
      type: Sequelize.STRING,
    },
    sub_seq: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Submenu;
};