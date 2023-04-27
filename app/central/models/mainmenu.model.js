

module.exports = (sequelize, Sequelize) => {
  const Mainmenu = sequelize.define("mainmenus", {
    main_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    main_title: {
      type: Sequelize.STRING,
    },
    main_link: {
      type: Sequelize.STRING,
    },
    main_seq: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Mainmenu;
};