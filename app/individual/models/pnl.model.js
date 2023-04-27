module.exports = (sequelize, Sequelize) => {
    const PNL_details = sequelize.define("pnl_details", {
      pnl_det_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      start_date: {
        type: Sequelize.STRING,
      },
      end_date: {
        type: Sequelize.STRING,
      },
      total_sale: {
        type: Sequelize.INTEGER,
      },
      total_expense: {
        type: Sequelize.INTEGER,
      },
      total_sale_amt: {
        type: Sequelize.DECIMAL(10, 2),
      },
      total_expense_amt: {
        type: Sequelize.DECIMAL(10, 2),
      },
      pnl_gen_date: {
        type: Sequelize.DATEONLY,
      },
      pnl_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      is_in_profit: {
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
    return PNL_details;
  };