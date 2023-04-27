

module.exports = (sequelize, Sequelize) => {
  const Role_permission = sequelize.define("role_permission", {
    permission_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    role_id: {
      type: Sequelize.INTEGER,
    },
    main_id: {
      type: Sequelize.INTEGER,
    },
    sub_id:{
        type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Role_permission;
};