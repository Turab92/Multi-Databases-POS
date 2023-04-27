//const { sequelize, Sequelize } = require("./user");

module.exports = (sequelize, Sequelize) => {
  const Vendor_setup = sequelize.define("vendor_setup", {
    vendor_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },  
    vendor_name: {
      type: Sequelize.STRING,
    },
    contact_no: {
      type: Sequelize.STRING,
    },
    mobile_no: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    payment_mode: {
      type: Sequelize.STRING,
    },
    remarks: {
        type: Sequelize.STRING,
    },
    user_id: {
        type: Sequelize.INTEGER,
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
    with_holding: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
  }
  );
  return Vendor_setup;
};