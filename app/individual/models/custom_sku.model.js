module.exports = (sequelize, Sequelize) => {
    const Custom_sku = sequelize.define("custom_sku", {
      cus_sku_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      cus_sku_name: {
        type: Sequelize.STRING,
      }, 
      cus_sku_image: {
        type: Sequelize.STRING,
      },
      uom_id:{
          type: Sequelize.INTEGER,
      },
      cus_sku_uom:{
          type: Sequelize.INTEGER,
      },
      cus_sku_rate:{
          type: Sequelize.DECIMAL(10, 2),
      },
      is_approved: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Custom_sku;
  };