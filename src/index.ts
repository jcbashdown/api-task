import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Sequelize } from 'sequelize-typescript'

import { sequelize, authenticateDatabase } from './sequelize';
import { typeDefs, resolvers } from './graphql/schema';

interface MyContext {
  token?: string;
  db: Sequelize;
}

async function startServer() {
    const app = express();
    const httpServer = http.createServer(app);


    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/',
        cors<cors.CorsRequest>(), //consider if we want to be stricter - do we want to authorize client by client based a registry of clients?
        express.json(),
        expressMiddleware(server, {
            context: async ({ req }) => ({ 
              token: req.headers.token as string | undefined,
              db: sequelize
            }),
        }),
    );

    await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/`);
}

//Would be nice to use a top level await but that's breaking some imports in transpiled code
//See readme for more info
startServer().catch(error => {
    console.error(error);
    process.exit(1);
});
