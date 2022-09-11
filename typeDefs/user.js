const { gql } = require('apollo-server-express')

const userTypeDefs = gql`
  extend type Query {
    users: [User!]
 #  user(userId: ID!): User
    user: User
  }

  extend type Mutation {
  	signup(input: signupInput!): User
  	login(input: loginInput!): Token
  }

  input signupInput {
  	name: String!
  	email: String!
  	password: String!
  	confirmPassword: String!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    # createdAt: String!
    # updatedAt: String!
    tasks: [Task!]
  }

  input loginInput {
  	email: String!
  	password: String!
  }
  type Token {
  	token: String!
  }
`

module.exports = userTypeDefs
