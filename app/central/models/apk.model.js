module.exports = (sequelize, Sequelize) => {
    const APK_Details = sequelize.define("apk_detail", {
      apk_det_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      rest_desktop_apk: {
        type: Sequelize.STRING
      }, 
      rest_android_apk: {
        type: Sequelize.STRING
      }, 
      mart_desktop_apk: {
        type: Sequelize.STRING
      },  
      mart_android_apk: {
        type: Sequelize.STRING
      }, 
      remarks: {
        type: Sequelize.STRING
      }, 
      status: {
        type: Sequelize.INTEGER,
      },
    });
  
    return APK_Details;
  };