const { gql } = require('apollo-server-express')

const userTypeDefs = gql`
  extend type Query {
    users: [User!]
    user(userId: ID!): User
  }

  type User {
    id: ID!
    name: String
    email: String
    tasks: [Task!]
  }
`

module.exports = userTypeDefs
