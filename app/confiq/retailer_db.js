exports.finddb=(dbname)=>{
    const finddb = require("../../app/individual/models/user");
    const db=finddb.getdb(dbname)

    return db
  };