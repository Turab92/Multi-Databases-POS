module.exports = (sequelize, Sequelize) => {
    const Client_setup = sequelize.define("client_setup", {
      client_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },  
      client_name: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      entity_type: {
        type: Sequelize.STRING,
      },
      federal_tax_no: {
        type: Sequelize.STRING,
      },
      regional_tax_no: {
        type: Sequelize.STRING,
      },
      tax_filer_status: {
          type: Sequelize.STRING,
      },
      tax_region: {
          type: Sequelize.STRING,
      },
      sales_tax_no: {
        type: Sequelize.STRING,
      },
      sales_tax_exempted: {
          type: Sequelize.STRING,
      },
      meeting_address: {
          type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      province: {
          type: Sequelize.STRING,
      },
      city: {
          type: Sequelize.STRING,
      },
      email_address: {
        type: Sequelize.STRING,
      },
      phone_no: {
          type: Sequelize.STRING,
      },
      reference: {
          type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
    }
    );
    return Client_setup;
  };