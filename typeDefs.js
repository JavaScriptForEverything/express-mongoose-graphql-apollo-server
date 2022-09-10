const { gql } = require('apollo-server-express')

module.exports.typeDefs = gql`
  type Query {
    greeting: String
  }
  type User {
    id: ID!
    name: String
    email: String
    tasks: [Task!]
  }
  type Task {
    id: ID!
    name: String
    completed: Boolean
    Task: User
  }
`