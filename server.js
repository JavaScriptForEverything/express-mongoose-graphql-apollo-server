require('dotenv').config()
const exporess = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const cors = require('cors')
const path = require('path')

const { users, tasks } = require('./data/demo')

const app = exporess()
app.use( cors() )
app.use( exporess.static(path.join( process.cwd(), 'public' ) ) )
app.use( exporess.json() )
// ---------

const typeDefs = gql`
  type Query {
    tasks: [Task!]
    task(taskId: ID!): Task

    users: [User!]
    user(userId: ID!): User
  }

  type Task {
    id: ID!
    name: String
    completed: Boolean
    user: User
  }
  type User {
    id: ID!
    name: String
    email: String
    tasks: [Task!]
  }

  type Mutation {
  	createTask(input: createTaskInput!): Task
  }
  input createTaskInput {
  	name: String!
  	completed: Boolean!
  	userId: ID!
  }
`

const resolvers = {
  Query : {
    tasks: () => tasks,
    task: (_, args) => tasks.find( task => task.id === args.taskId ),

    users: () => users,
    user: (_, args) => users.find( user => user.id === args.userId )
  },

  Task: {
		user: ( parent ) => users.find(user => user.id === parent.userId )
  },
  User: {
  	tasks: (parent) => tasks.filter( task => task.userId === parent.id)
  },

  Mutation: {
  	createTask: (_, args) => {
  		const task = { ...args.input, id: Date.now() } 		// add id which is required field
  		tasks.push(task) 																	// add task into tasks array

  		return task 																			// finally return modified task as response
  	}
  },

}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

apolloServer.start().then( () => {
  apolloServer.applyMiddleware({ app, path: '/graphql' })
})

// ---------
app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello server'
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port: ${PORT} on ${apolloServer.graphqlPath}`))




/* Client Request:

query ExampleQuery {
  tasks{
    id
    name
    completed
  }
}



query ExampleQuery {
  tasks {
    id
    name
    user {
      id
      name
      email
    }
  }
}


mutation createTask {
  createTask(input: {
    name: "task one",
    completed: false,
    userId: 1
  }) {
    id
    name
    user {
      id
      name
      email
    }
  }
}


*/
