module.exports = (sequelize, Sequelize) => {
    const Br_mat_sale = sequelize.define("br_mat_sale", {
      br_sale_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      om_id: {
        type: Sequelize.INTEGER,
      },
      od_id: {
        type: Sequelize.INTEGER,
      },
      dept_id: {
        type: Sequelize.INTEGER,
      },
      sub_pro_id: {
        type: Sequelize.INTEGER,
      },
      ds_id: {
        type: Sequelize.INTEGER,
      },
      material_id: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      so_unit_qty: {
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
    return Br_mat_sale;
  };