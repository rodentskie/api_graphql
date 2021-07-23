import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { HelloWorldResolver } from './resolvers/HelloWorldResolver';
import dotenv from 'dotenv';
import Koa from 'koa';
dotenv.config();

(async () => {
    const app = new Koa();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloWorldResolver]
        }),
        context: ({ req, res }) => ({ req, res })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    const port = process.env.PORT || 5000;

    app.listen(port, () => {
        console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
    });

    return { apolloServer, app };
})();
