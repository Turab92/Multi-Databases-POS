const { PubSub, withFilter } = require("graphql-subscriptions");
const pubSub = new PubSub();
const dbConfig = require("../app/confiq/db.config");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const jwt = require("jsonwebtoken");
const config = require("../app/confiq/auth.config.js");
const db = require("../app/central/models/user");
const Retailer = db.retailer

module.exports = {
    Mutation: {
        async createInventory(_, { inventoryInput: { accessToken, deptId } }) {
            const accessTok = accessToken;
            const deptIds = deptId;
            // console.log(accessTok)

            // var config = {
            //     method: 'get',
            //     url: 'https://pointofsaleerp.com:8080/get_inventory/' + deptIds.toString(),
            //     headers: {
            //         'x-access-token': accessTok
            //     }
            // };
            jwt.verify(accessTok, config.secret, async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return 0;
                }
                else {

                    if (decoded.user.is_retailer == 1) {
                        var data = await Retailer.findByPk(decoded.user.retailer_id)
                        if (!data) {
                            console.log("not found");
                        }
                        else {
                            // const ret_db = require("../individual/models/user");
                            const ret_db = require("../app/individual/models/user");
                            // var ret_dbs = ret_db.getdb(data.dataValues.retailer_unique_no)
                            var ret_dbname = data.dataValues.retailer_unique_no;

                            const sequelize = new Sequelize(ret_dbname, dbConfig.USER, dbConfig.PASSWORD, {
                                host: dbConfig.HOST,
                                dialect: dbConfig.dialect,
                                operatorAliases: 0,

                                pool: {
                                    max: dbConfig.pool.max,
                                    min: dbConfig.pool.min,
                                    acquire: dbConfig.pool.acquire,
                                    idle: dbConfig.pool.idle,
                                },
                            });

                            const result = await sequelize.query(`Select grn.material_id, raw.material_name, SUM(grn.recv_unit_qty) as purchase,
  (SELECT SUM(sale.quantity) FROM mart_order_details sale WHERE sale.material_id = grn.material_id and sale.status != 2 and sale.dept_id = `+ deptIds + `) as sale from
  br_grn_details as grn join raw_materials as raw on raw.material_id = grn.material_id
  where grn.status = 1 and grn.dept_id = `+ deptIds + ` and raw.status = 1
  group by grn.material_id, raw.material_name
  
  `, { type: QueryTypes.SELECT });

                            if (!result.length) {
                                console.log("Something went wrong");
                            }
                            else {
                                for (var item of result) {
                                    item.depart_id = deptIds
                                    pubSub.publish('inventoryCreated', {
                                        inventoryCreated: item
                                    })
                                }
                            }
                        }
                    }
                }
            });

            return {
                id: deptIds
            }
        },



        async updateEndpointMutation(_, { endPointInput: { endPoint, depart_id } }) {
            pubSub.publish('endpointUpdated', {
                endpointUpdated: {
                    endPoint: endPoint,
                    depart_id: depart_id
                }
            })


            return {
                endPoint: endPoint
            }
        }
    },
    Subscription: {
        inventoryCreated: {
            subscribe: withFilter(() =>

                pubSub.asyncIterator("inventoryCreated"), (payload, args) => {

                    return (!args.depart_id || payload.inventoryCreated.depart_id === args.depart_id)
                })
        },

        endpointUpdated: {
            subscribe: withFilter(() =>

                pubSub.asyncIterator("endpointUpdated"), (payload, args) => {
                    console.log(payload)

                    return (payload.endpointUpdated.depart_id === args.depart_id)
                })
        }

    }
}
