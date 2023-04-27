module.exports = (sequelize, Sequelize) => {
    const Retailer_setup = sequelize.define("retailer_setup", {
      retailer_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      }, 
      retailer_unique_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      owner_name: {
        type: Sequelize.STRING,
      },  
      owner_phone_no: {
        type: Sequelize.STRING,
        unique: true
      }, 
      owner_nic_no: {
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
      hash_key: {
        type: Sequelize.TEXT,
      },
    }
    );
    return Retailer_setup;
  };