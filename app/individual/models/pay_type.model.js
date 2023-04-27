

module.exports = (sequelize, Sequelize) => {
  const Payment_type = sequelize.define("payment_type", {
    p_type_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    p_type_name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Payment_type;
};