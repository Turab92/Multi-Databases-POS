module.exports = (sequelize, Sequelize) => {
    const Add_to_cart = sequelize.define("add_to_cart", {
      cart_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      session_id : {
        type: Sequelize.STRING,
      },
      item_id : {
        type: Sequelize.INTEGER,
      },
      item_type: {
        type: Sequelize.STRING,
      },
      quantity : {
        type: Sequelize.DECIMAL(10, 2),
      },
      status : {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Add_to_cart;
  };