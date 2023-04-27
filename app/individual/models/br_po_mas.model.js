module.exports = (sequelize, Sequelize) => {
    const Br_po_master = sequelize.define("br_po_master", {
      br_po_mid: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      br_po_date: {
        type: Sequelize.STRING,
      },
      br_pr_mid: {
        type: Sequelize.INTEGER,
      },
      br_purchase_term: {
        type: Sequelize.STRING,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      order_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      random_no: {
        type: Sequelize.STRING,
      },
      po_remarks: {
          type: Sequelize.STRING,
      },
      user_id: {
          type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Br_po_master;
  };