module.exports = (sequelize, Sequelize) => {
    const Expense_type = sequelize.define("expense_type", {
      exp_type_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      exp_type_name: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Expense_type;
  };