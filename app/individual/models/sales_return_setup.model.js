module.exports = (sequelize, Sequelize) => {
    const Sale_return_setup = sequelize.define("sale_return_setup", {
     sale_return_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      material_id: {
        type: Sequelize.INTEGER,
      },
      mat_cat_id: {
        type: Sequelize.INTEGER,
      },
      return_qty: {
        type: Sequelize.INTEGER,
      },
      m_od_id:{
          type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      return_date:{
          type: Sequelize.DATEONLY,
      },
      ret_shift_id:{
          type: Sequelize.INTEGER,
      },
      user_id:{
          type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Sale_return_setup;
  };