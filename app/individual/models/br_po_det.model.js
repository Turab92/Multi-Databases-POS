module.exports = (sequelize, Sequelize) => {
    const Br_po_detail = sequelize.define("br_po_detail", {
      br_po_did: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      br_po_mid: {
        type: Sequelize.INTEGER,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      material_id: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      req_unit_qty: {
        type: Sequelize.DECIMAL(10, 2),
      },
      po_unit_qty: {
        type: Sequelize.DECIMAL(10, 2),
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Br_po_detail;
  };