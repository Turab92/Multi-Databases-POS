

module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("sessions", {
    userid: {
      type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.STRING(2048),
    },
  });
  return Session;
};