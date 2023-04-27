module.exports = (sequelize, Sequelize) => {
    const Online_ord_mas = sequelize.define("online_ord_mas", {
      on_om_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      dept_id: {
        type: Sequelize.INTEGER,
      },  
      area_id: {
        type: Sequelize.INTEGER,
      },
      transfer_dept_id: {
        type: Sequelize.INTEGER,
      },
      cus_id: {
      type: Sequelize.INTEGER,
      },
      ot_de_id: {
      type: Sequelize.INTEGER,
      },
      ord_date: {
        type: Sequelize.STRING,
        },    
      item_total: {
      type: Sequelize.DECIMAL(10, 2),
      },
      deal_total: {
        type: Sequelize.DECIMAL(10, 2),
      },
      disc_id: {
      type: Sequelize.INTEGER,
      },
      discount: {
      type: Sequelize.DECIMAL(10, 2),
      },
      net_item: {
        type: Sequelize.DECIMAL(10, 2),
      },
      tax_id: {
      type: Sequelize.INTEGER,
      },
      tax_amount: {
      type: Sequelize.DECIMAL(10, 2),
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      delivery_charges: {
        type: Sequelize.DECIMAL(10, 2),
      },
      net_amount: {
        type: Sequelize.DECIMAL(10, 2),
      }, 
      comment: {
        type: Sequelize.STRING
      },
      prepared_time: {
        type: Sequelize.INTEGER,
      },
      prepared_status: {
        type: Sequelize.INTEGER,
      },
      delivery_time: {
        type: Sequelize.INTEGER
      },
      delivered_status: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Online_ord_mas;
  };