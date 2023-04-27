

module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    pro_name: {
      type: Sequelize.STRING,
    },
    pro_image: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Product;
};