const { gql } = require('apollo-server-express')

const userTypeDefs = gql`
  extend type Query {
    users: [User!]
    user(userId: ID!): User
  }

  extend type Mutation {
  	signup(input: signupInput!): User
  }

  input signupInput {
  	name: String!
  	email: String!
  	password: String!
  	confirmPassword: String!
  }

  type User {
    id: ID!
    name: String
    email: String
    tasks: [Task!]
  }
`

module.exports = userTypeDefs
