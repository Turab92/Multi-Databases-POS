

module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define("customer", {
    cus_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    cus_name: {
      type: Sequelize.STRING,
    },
    cus_email: {
      type: Sequelize.STRING,
    },
    cus_address: {
      type: Sequelize.STRING,
    },
    cus_phone: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Customer;
};