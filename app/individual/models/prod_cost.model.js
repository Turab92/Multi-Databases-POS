module.exports = (sequelize, Sequelize) => {
  const Product_cost = sequelize.define("product_cost", {
    p_cost_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    sub_pro_id: {
      type: Sequelize.INTEGER,
    },
    material_id: {
      type: Sequelize.INTEGER,
    },
    unit_or_weight: {
      type: Sequelize.DECIMAL(10, 2),
    },
    cost:{
        type: Sequelize.DECIMAL(10, 2),
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Product_cost;
};