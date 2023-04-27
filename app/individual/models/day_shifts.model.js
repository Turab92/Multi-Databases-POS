module.exports = (sequelize, Sequelize) => {
    const Day_shifts = sequelize.define("day_shift", {
      shift_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      start_time: {
        type: Sequelize.STRING,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      day_id: {
        type: Sequelize.INTEGER,
      },
      shift_opening_amt: {
        type: Sequelize.DECIMAL(10, 2),
      },
      cash_received: {
        type: Sequelize.DECIMAL(10, 2),
      },
      online_sale: {
        type: Sequelize.DECIMAL(10, 2),
      },
      cash_return: {
        type: Sequelize.DECIMAL(10, 2),
      },
      shift_close_amt: {
        type: Sequelize.DECIMAL(10, 2),
      },
      active: {
        type: Sequelize.INTEGER,
      },
      close_time: {
        type: Sequelize.STRING,
      },
      shift_close: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Day_shifts;
  };