module.exports = (sequelize, Sequelize) => {
  const Order_detail = sequelize.define("order_detail", {
    od_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    dept_id: {
      type: Sequelize.INTEGER,
    },  
    ord_mas_id: {
      type: Sequelize.INTEGER,
    },
    main_pro_id: {
        type: Sequelize.INTEGER,
      },
    sub_pro_id: {
      type: Sequelize.INTEGER,
    },
    ds_id: {
      type: Sequelize.INTEGER,
    },
    db_id: {
      type: Sequelize.INTEGER,
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
      },
    quantity: {
    type: Sequelize.DECIMAL(10, 2),
    },
    total: {
    type: Sequelize.DECIMAL(10, 2),
    },
    discount: {
      type: Sequelize.DECIMAL(10, 2),
    },
    net_total: {
      type: Sequelize.DECIMAL(10, 2),
    },
    user_id: {
    type: Sequelize.INTEGER,
    },    
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Order_detail;
};