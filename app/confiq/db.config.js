module.exports = {
    HOST: "localhost", // Replace it with your own host address
    USER: "postgres", // Replace with your own username
    PASSWORD: "12345", // Replace with your own password
    DB: "main_db",
    dialect: "postgres",
    pool: {
      max: 100,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };