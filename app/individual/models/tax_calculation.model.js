module.exports = (sequelize, Sequelize) => {
    const Tax_calculation = sequelize.define("tax_calculation", {
      tax_cal_id: {
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
      tax_percentage: {
        type: Sequelize.DECIMAL(10, 2),
      },
      total_tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      tax_gen_date: {
        type: Sequelize.DATEONLY,
      },
      total_mat_sale: {
        type: Sequelize.INTEGER,
      },
      total_mat_sale_qty: {
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
    return Tax_calculation;
  };