import { readFileSync } from 'fs';
import { ApolloServer } from 'apollo-server-express';
import { MongoClient } from 'mongodb';

import express from 'express';
import expressPlayground from 'graphql-playground-middleware-express';
const graphQLPlayground = expressPlayground.default;
import { resolvers } from './resolvers/resolvers.js';
const typeDefs = readFileSync(`./typeDefs.graphql`, `UTF-8`);

const start = async () => {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB, {
    useNewUrlParser: true,
  });

  const db = client.db();
  const context = { db };

  const server = new ApolloServer({ typeDefs, resolvers, context });
  await server.start();
  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welome to the PhotoShare API'));

  app.get(`/playground`, graphQLPlayground({ endpoint: `/graphql` }));

  app.listen({ port: 4000 }, () => {
    console.log(
      `GraphQL Server running @ http://localhost:4000${server.graphqlPath}`
    );
  });
};

start();
