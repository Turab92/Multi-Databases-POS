module.exports = (sequelize, Sequelize) => {
    const Deal_beverage = sequelize.define("deal_beverage", {
      db_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      ds_id: {
        type: Sequelize.INTEGER,
      },  
      sub_pro_id: {
        type: Sequelize.INTEGER,
      },
      sub_qty: {
        type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        type: Sequelize.INTEGER,
      }
    }
    );
    return Deal_beverage;
  };