module.exports = (sequelize, Sequelize) => {
  const Deal_item = sequelize.define("deal_item", {
    di_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    ds_id: {
      type: Sequelize.INTEGER,
    },  
    dp_id: {
      type: Sequelize.INTEGER,
    },
    sub_pro_id: {
      type: Sequelize.INTEGER,
    },
    sub_price: {
      type: Sequelize.DECIMAL(10, 2),
    },
    sub_qty: {
      type: Sequelize.DECIMAL(10, 2),
    },
    total: {
      type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Deal_item;
};