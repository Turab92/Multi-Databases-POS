module.exports = (sequelize, Sequelize) => {
    const Expense_setup = sequelize.define("expense_setup", {
      expense_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      exp_type_id: {
        type: Sequelize.INTEGER,
      },
      expense_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      exp_date: {
        type: Sequelize.STRING,
      },
      payment_type: {
        type: Sequelize.STRING,
      },
      invoice_no: {
        type: Sequelize.STRING,
      },
      invoice_img: {
        type: Sequelize.STRING,
      },
      payment_status: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Expense_setup;
  };