module.exports = (sequelize, Sequelize) => {
  const Department_setup = sequelize.define("department_setup", {
    dept_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    dept_name: {
      type: Sequelize.STRING,
    }, 
    dept_type_id: {
      type: Sequelize.INTEGER,
    },  
    parent_dept_id: {
      type: Sequelize.INTEGER,
    },  
    retailer_id: {
      type: Sequelize.INTEGER,
    },
    owner_name: {
      type: Sequelize.STRING,
    },  
    owner_phone_no: {
      type: Sequelize.STRING,
      unique: true
    },  
    owner_email: {
      type: Sequelize.STRING,
      unique: true
    },  
    shop_address: {
      type: Sequelize.STRING,
    },  
    shop_long: {
      type: Sequelize.DECIMAL(10, 2),
    },  
    shop_lat: {
      type: Sequelize.DECIMAL(10, 2),
    },
    shop_postal_code: {
      type: Sequelize.INTEGER,
    },  
    shop_country: {
      type: Sequelize.STRING,
    },  
    shop_city: {
      type: Sequelize.STRING,
    },
    shop_area: {
      type: Sequelize.STRING,
    },  
    shop_open_time: {
      type: Sequelize.STRING,
    },
    shop_close_time: {
      type: Sequelize.STRING,
    },  
    status: {
      type: Sequelize.INTEGER,
    },
    delivery_status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Department_setup;
};