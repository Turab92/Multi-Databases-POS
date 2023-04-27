module.exports = (sequelize, Sequelize) => {
    const Mart_order_detail = sequelize.define("mart_order_detail", {
      m_od_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      m_om_id: {
        type: Sequelize.INTEGER,
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },
      material_id: {
        type: Sequelize.INTEGER,
      },
      mat_cat_id: {
        type: Sequelize.INTEGER,
      },
      price: {
          type: Sequelize.DECIMAL(10, 2),
        },
      purchase_rate: {
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
      total_uom: {
        type: Sequelize.DECIMAL(10, 2),
      },
      net_total: {
        type: Sequelize.DECIMAL(10, 2),
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      is_return: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      sale_return_id: {
        type: Sequelize.INTEGER,
      },
      is_exchange: {
        type: Sequelize.INTEGER,
        defaultValue:0
      },
      exchange_id: {
        type: Sequelize.INTEGER,
      },    
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Mart_order_detail;
  };