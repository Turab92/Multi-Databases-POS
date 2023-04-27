module.exports = (sequelize, Sequelize) => {
  const Order_master = sequelize.define("order_master", {
    om_id: {
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
    day_id: {
      type: Sequelize.INTEGER,
    },
    shift_id: {
      type: Sequelize.INTEGER,
    },
    till_id: {
        type: Sequelize.INTEGER,
      },
    cus_id: {
    type: Sequelize.INTEGER,
    },
    user_id: {
        type: Sequelize.INTEGER,
      },
    ot_de_id: {
    type: Sequelize.INTEGER,
    },
    pt_de_id: {
    type: Sequelize.INTEGER,
    },
    ord_notes: {
    type: Sequelize.STRING,
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
    cancel_reason: {
      type: Sequelize.STRING,
    },
    is_print: {
      type: Sequelize.INTEGER,
      defaultValue:0
    },
    kit_print: {
      type: Sequelize.INTEGER,
      defaultValue:0
    },  
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Order_master;
};