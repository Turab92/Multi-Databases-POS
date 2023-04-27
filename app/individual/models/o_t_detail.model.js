

module.exports = (sequelize, Sequelize) => {
  const Order_type_detail = sequelize.define("order_type_detail", {
    ot_d_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    ord_type_id: {
      type: Sequelize.INTEGER,
    },
    ord_mas_id: {
        type: Sequelize.INTEGER,
      },
    cus_id: {
      type: Sequelize.INTEGER,
      },
    cus_name: {
      type: Sequelize.STRING,
      },
    cus_phone: {
      type: Sequelize.STRING,
      },
    cus_email: {
      type: Sequelize.STRING,
      },
    cus_address: {
      type: Sequelize.STRING,
      },
    table_no: {
        type: Sequelize.STRING,
      },
    members: {
      type: Sequelize.STRING,
    }, 
    ord_booker: {
      type: Sequelize.INTEGER,
    }, 
    del_person: {
    type: Sequelize.STRING,
    },
    del_phone: {
      type: Sequelize.STRING,
    },
    order_type: {
      type: Sequelize.STRING,
    },
    online_type: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Order_type_detail;
};