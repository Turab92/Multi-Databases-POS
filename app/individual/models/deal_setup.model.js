module.exports = (sequelize, Sequelize) => {
  const Deal_setup = sequelize.define("deal_setup", {
    ds_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    ds_name: {
      type: Sequelize.STRING,
    },  
    ds_desc: {
      type: Sequelize.STRING,
    },
    dp_id: {
      type: Sequelize.INTEGER,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
      },
    ds_img: {
    type: Sequelize.STRING,
    },  
    is_combo: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Deal_setup;
};