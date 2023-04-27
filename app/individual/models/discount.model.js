

module.exports = (sequelize, Sequelize) => {
  const Discount = sequelize.define("discount", {
    disc_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    comp_name: {
      type: Sequelize.STRING,
    },
    disc_amount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Discount;
};