module.exports = (sequelize, Sequelize) => {
    const Branch_product = sequelize.define("branch_product", {
      br_pro_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      sub_pro_id:{
          type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Branch_product;
  };