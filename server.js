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
  }
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



*/