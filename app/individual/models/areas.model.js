module.exports = (sequelize, Sequelize) => {
    const Branch_area = sequelize.define("branch_area", {
      area_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      area_name: {
        type: Sequelize.STRING,
      },
      delivery_charges: {
        type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Branch_area;
  };