module.exports = (sequelize, Sequelize) => {
    const Printer_detail = sequelize.define("printer_detail", {
      printer_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      till_id: {
        type: Sequelize.INTEGER,
      },
      till_printer: {
        type: Sequelize.STRING,
      },
      kitchen_printer:{
          type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Printer_detail;
  };