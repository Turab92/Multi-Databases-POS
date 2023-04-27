
module.exports = (sequelize, Sequelize) => {
    const Dept_type = sequelize.define("dept_type", {
        dept_type_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      dept_type_name: {
        type: Sequelize.STRING
      },  
      status: {
        type: Sequelize.INTEGER,
      },
    });
  
    return Dept_type;
  };