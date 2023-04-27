module.exports = (sequelize, Sequelize) => {
    const Tax_setup = sequelize.define("tax_setup", {
      tax_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      tax_name: {
        type: Sequelize.STRING,
      },
      tax_percentage: {
        type: Sequelize.DECIMAL(10, 2),
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Tax_setup;
  };