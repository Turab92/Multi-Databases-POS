module.exports = (sequelize, Sequelize) => {
  const Payment_type_detail = sequelize.define("payment_type_detail", {
    pt_d_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    pay_type_id: {
      type: Sequelize.INTEGER,
    },
    ord_mas_id: {
        type: Sequelize.INTEGER,
      },
    cus_id: {
    type: Sequelize.INTEGER,
    },
    card_no: {
        type: Sequelize.STRING,
      },
    card_type: {
       type: Sequelize.STRING,
    },  
    acc_title: {
       type: Sequelize.STRING,
    },
    bank_name: {
       type: Sequelize.STRING,
    },
    reason: {
        type: Sequelize.STRING,
      },
    per_name: {
        type: Sequelize.STRING,
    },  
    per_phone: {
        type: Sequelize.STRING,
    },
    per_email: {
        type: Sequelize.STRING,
    },  
    cash_received: {
        type: Sequelize.DECIMAL(10, 2),
    },
    cash_return: {
        type: Sequelize.DECIMAL(10, 2),
    },
    status: {
        type: Sequelize.INTEGER,
    },
  }
  );
  return Payment_type_detail;
};