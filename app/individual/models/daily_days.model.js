module.exports = (sequelize, Sequelize) => {
    const Daily_day = sequelize.define("daily_day", {
      day_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      start_date: {
        type: Sequelize.STRING,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      till_id: {
        type: Sequelize.INTEGER,
      },
      till_opening: {
        type: Sequelize.DECIMAL(10, 2),
      },
      received: {
        type: Sequelize.DECIMAL(10, 2),
      },
      online_sale: {
        type: Sequelize.DECIMAL(10, 2),
      },
      cash_return: {
        type: Sequelize.DECIMAL(10, 2),
      },
      till_close: {
        type: Sequelize.DECIMAL(10, 2),
      },
      active: {
        type: Sequelize.INTEGER,
      },
      close_date: {
        type: Sequelize.STRING,
      },
      day_close: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Daily_day;
  };