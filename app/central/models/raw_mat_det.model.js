module.exports = (sequelize, Sequelize) => {
    const Raw_mat_detail = sequelize.define("raw_mat_detail", {
      mat_det_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      mat_mas_id: {
        type: Sequelize.INTEGER,
      },
      material_id: {
        type: Sequelize.INTEGER,
      },
      mat_det_uom:{
          type: Sequelize.DECIMAL(10, 2),
      },
      mat_det_rate:{
          type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Raw_mat_detail;
  };