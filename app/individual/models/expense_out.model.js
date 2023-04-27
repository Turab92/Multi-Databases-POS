module.exports = (sequelize, Sequelize) => {
    const Expense_out = sequelize.define("expense_out", {
      exp_out_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      expense_id: {
        type: Sequelize.INTEGER,
      },
      expense_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      exp_paid_date: {
        type: Sequelize.STRING,
      },
      payment_type: {
        type: Sequelize.STRING,
      },
      paid_invoice_no: {
        type: Sequelize.STRING,
      },
      paid_invoice_img: {
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
    return Expense_out;
  };