const exporess = require('express')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const path = require('path')

const resolvers = require('./resolvers')
const typeDefs = require('./typeDefs')

const app = exporess()
app.use( cors() )
app.use( exporess.static(path.join( process.cwd(), 'public' ) ) )
app.use( exporess.json() )
// ---------


const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

apolloServer.start().then( () => {
  apolloServer.applyMiddleware({ app, path: '/graphql' })
})

// ---------
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello server'
  })
})

module.exports = { app, apolloServer }



/* Client Request:

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

query getTasks {
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

query getTaskById {
  task(taskId: 1) {
    id
    name
    completed
    user {
      id
      name
    }
  }
}

query getUsers {
  users {
    id
    name
    email
  }
}

query getUserById {
  user(userId: 1) {
    id
    name
    email,
    tasks {
      id
      name
      completed
    }
  }
}


*/
