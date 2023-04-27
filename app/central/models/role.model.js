

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
      role_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      },
      for_retailer: {
        type: Sequelize.INTEGER
      }
    });
  
    return Role;
  };