module.exports = (sequelize, Sequelize) => {
    const Exchange_setup = sequelize.define("exchange_setup", {
     exchange_id: {
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
      exchange_qty: {
        type: Sequelize.DECIMAL(10, 2),
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      m_od_id:{
          type: Sequelize.INTEGER,
      },
      exchange_date:{
          type: Sequelize.STRING,
      },
      exch_shift_id:{
          type: Sequelize.INTEGER,
      },
      new_m_om_id:{
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
    return Exchange_setup;
  };