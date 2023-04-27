module.exports = (sequelize, Sequelize) => {
    const Online_ord_det = sequelize.define("online_ord_det", {
      on_od_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },  
      on_om_id: {
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
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Online_ord_det;
  };