module.exports = (sequelize, Sequelize) => {
    const Raw_mat_category = sequelize.define("raw_mat_category", {
      mat_cat_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      material_id: {
        type: Sequelize.INTEGER,
      },
      mat_cat_name: {
        type: Sequelize.STRING,
      },
      mat_cat_image: {
        type: Sequelize.STRING,
      },
      mat_cat_barcode:{
          type: Sequelize.STRING,
      },
      mat_cat_uom:{
          type: Sequelize.DECIMAL(10, 2),
      },
      mat_cat_disc:{
          type: Sequelize.DECIMAL(10, 2),
      },
      mat_cat_rate:{
          type: Sequelize.DECIMAL(10, 2),
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Raw_mat_category;
  };