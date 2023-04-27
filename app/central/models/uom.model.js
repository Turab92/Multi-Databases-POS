//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const UOM = sequelize.define("uom", {
    uom_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    uom_name: {
      type: Sequelize.STRING,
    },
  }
  );
  return UOM;
};