

module.exports = (sequelize, Sequelize) => {
  const Sub_product = sequelize.define("sub_products", {
    sub_pro_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    sub_pro_name: {
      type: Sequelize.STRING,
    },  
    product_id: {
      type: Sequelize.INTEGER,
    },
    sub_pro_desc: {
      type: Sequelize.STRING,
    },
    sub_pro_price: {
      type: Sequelize.STRING,
    },
    sub_pro_image: {
      type: Sequelize.STRING,
    },
    sub_pro_app_image: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Sub_product;
};