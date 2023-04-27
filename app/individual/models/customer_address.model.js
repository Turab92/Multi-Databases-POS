module.exports = (sequelize, Sequelize) => {
    const Customer_address = sequelize.define("customer_address", {
      address_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },  
      area_id: {
        type: Sequelize.INTEGER,
      },  
      cus_id: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      address_label: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Customer_address;
  };