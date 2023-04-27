// Bring in required Modules
const express = require("express");
const { createServer } = require("https");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { execute, subscribe } = require("graphql")
const { ApolloServer } = require("apollo-server-express")
const {SubscriptionServer} =require("subscriptions-transport-ws")
const fs = require('fs');
require('dotenv').config();

(async function () {
    const app = express();

    const httpServer = createServer(
 {
        key: fs.readFileSync(`/etc/apache2/SSL/Wildcard-SSL/pointofsaleerp.key`),
        cert: fs.readFileSync(`/etc/apache2/SSL/Wildcard-SSL/STAR_pointofsaleerp_com.crt`)
      },

app);
    const schema = makeExecutableSchema({
        typeDefs, resolvers
    });

    const subcriptionServer = SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: '/graphql' }
    );
    const server = new ApolloServer({
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subcriptionServer.close();
                        }
                    }
                }
            }
        ]
    })
    await server.start();
    var PORT = 8443
    server.applyMiddleware({ app })

    httpServer.listen(PORT, () =>
        console.log("Server is now runing on " + PORT)
    );
}());