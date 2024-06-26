const { gql } = require('apollo-server-express');

// Import typeDefs and resolvers
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

// Export typeDefs and resolvers
module.exports = { typeDefs, resolvers };
