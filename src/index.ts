import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import { createConnection } from 'typeorm';
import { buildSchema } from 'type-graphql';
import { HelloWorldResolver } from './resolvers/HelloWorldResolver';
import { Hobbies } from './resolvers/Hobby';
import dotenv from 'dotenv';
import Koa from 'koa';
dotenv.config();

(async () => {
    const app = new Koa();
    await createConnection();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloWorldResolver, Hobbies]
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
