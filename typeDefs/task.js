const { gql } = require('apollo-server-express')

const tasktypeDefs = gql`
  extend type Query {
    tasks(skip: Int=0, limit: Int=5): [Task!]
    task(taskId: ID!): Task
  }
  extend type Mutation {
  	createTask(input: createTaskInput!): Task
  }

  input createTaskInput {
  	name: String!
  	completed: Boolean
#  	user: ID 								# user === Task.user._id
  }
  type Task {
    id: ID!
    name: String!
    completed: Boolean
    user: User
  }

`

module.exports = tasktypeDefs
