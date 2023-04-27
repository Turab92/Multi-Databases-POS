

module.exports = (sequelize, Sequelize) => {
  const Order_type = sequelize.define("order_type", {
    o_type_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    o_type_name: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Order_type;
};