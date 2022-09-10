const { gql } = require('apollo-server-express')

const tasktypeDefs = gql`
  extend type Query {
    tasks: [Task!]
    task(taskId: ID!): Task
  }

  type Task {
    id: ID!
    name: String
    completed: Boolean
    user: User
  }

  extend type Mutation {
  	createTask(input: createTaskInput!): Task
  }
  input createTaskInput {
  	name: String!
  	completed: Boolean!
  	userId: ID!
  }
`

module.exports = tasktypeDefs
