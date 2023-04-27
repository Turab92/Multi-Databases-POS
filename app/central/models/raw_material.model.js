module.exports = (sequelize, Sequelize) => {
  const Raw_material = sequelize.define("raw_material", {
    material_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    material_name: {
      type: Sequelize.STRING,
    }, 
    sku_code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    material_image: {
      type: Sequelize.STRING,
    },
    uom_id:{
        type: Sequelize.INTEGER,
    },
    material_uom:{
        type: Sequelize.INTEGER,
    },
    material_rate:{
        type: Sequelize.DECIMAL(10, 2),
    },
    allow_vendor: {
      type: Sequelize.INTEGER,
    },
    retailer_id: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Raw_material;
};