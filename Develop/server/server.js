// Manually set NODE_ENV for testing
process.env.NODE_ENV = 'production';

const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer } = require('@apollo/server');
const { authMiddleware } = require('./utils/auth');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }),

});

const startApolloServer = async () => {
  await server.start();
 
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  console.log('NODE_ENV:', process.env.NODE_ENV);
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  console.log('Static files path:', __dirname, '../client/build');
  console.log('Serving static files from client/build');
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use('/graphql', expressMiddleware(server, ));
console.log('GraphQL middleware setup complete.');

app.use(routes);



db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};
startApolloServer();
