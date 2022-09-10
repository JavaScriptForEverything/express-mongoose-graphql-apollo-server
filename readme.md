## Learing GraphQL with Express with ApolloServer

### Setup GraphQL with Express

###### Install require packages:

```
$ yarn add 	express
		apollo-server-express 		: apollo server (Server WebSocket)
		graphql 			: Dependency of 'apollo-server-express'

		cors 				: Enable CORS in API
```

### /data/demo.js 	: Test Data

```
exports.tasks = [
  { id: '1', name: 'Work',    	completed: true, userId: '3' },
  { id: '2', name: 'Eat',     	completed: true, userId: '1' },
  { id: '3', name: 'Shopping', 	completed: true, userId: '4' },
  { id: '4', name: 'Gym',     	completed: true, userId: '2' },
]

exports.users = [
  { id: '1', name: 'Keven',  email: 'keven@gmail.com' },
  { id: '2', name: 'John',   email: 'john@gmail.com' },
  { id: '3', name: 'Pitter', email: 'pitter@gmail.com' },
  { id: '4', name: 'Bob',    email: 'bob@gmail.com' },
]

```


### server.js
```
const exporess = require('express')
const cors = require('cors')
const { ApolloServer, gql } = require('apollo-server-express')

const { users, tasks } = require('./data/demo')

const app = exporess()
app.use( cors() )
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
  res.status(200).json({ status: 'success', message: 'Hello server' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port: ${PORT} on ${apolloServer.graphqlPath}`))

```


###### To Run server and access ApolloServer
	. $ nodemon server.js

	. (Browser) 	GET 	http://localhost:5000 			: Server Root
	.           	GET 	http://localhost:5000/graphql 		: GraphQL Endpoint


### Get tasks from Query

	Run the Query in GraphQL Server's client Request Section
		. Ctrl + Enter 		: to run the Query

```
query ExampleQuery {
  tasks{
    id
    name
    completed
  }
}
```


### Get Single task By ID

```
...
const typeDefs = gql`
  type Query {
    tasks: [Task!]

    task(taskId: ID!): Task 			// (1): Set TaskId Schema
  }
  ...

`

const resolvers = {
  Query : {
    tasks: () => tasks,

    task: (_, args) => tasks.find( task => task.id === args.taskId ), 	// (2) override userId with userObject
  },

}
...
```


###### Browser (Client Request)

```
query getTaskById {
  task(taskId: 1) {
    id
    name
    completed
  }
}
```



### Get Field Label Resolver == Populate fields

```
...
const typeDefs = gql`
  type Query {
    tasks: [Task!]
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
  ...

`

const resolvers = {
  Query : {
    tasks: () => tasks,
  },

  Task: {
  	// Field Label Resolver override Query Resolver's property: here userId with be overriden with userObject
	user: ( parent ) => users.find(user => user.id === parent.userId )
  },

}
...
```


###### Browser (Client Request)

```
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
```


### Get Field Label Resolver on both on User.task and Task.users

```
...
const typeDefs = gql`
  type Query {
    tasks: [Task!]
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
  ...

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
...
```



###### Browser (Client Request)
```
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
```

###### Mutation: Create/Update/Delete Task or User

```
...
const typeDefs = gql`
  type Mutation {
  	createTask(input: createTaskInput!): Task
  }
  input createTaskInput {
  	name: String!
  	completed: Boolean!
  	userId: ID!
  }
  ...

`

const resolvers = {
  Query : {
    tasks: () => tasks,
  }

  Mutation: {
  	createTask: (_, args) => {
  		const task = { ...args.input, id: Date.now() } 	// add id which is required field
  		tasks.push(task) 																// add task into tasks array

  		return task 					// finally return modified task as response
  	}
  },
...
```



###### Browser (Client Request)
```
mutation createTask {

  createTask(input: { 			// (1) Send Request with required fields as defined in Schema

    name: "task one",
    completed: false,
    userId: 1

  }) { 					// (2) Get response Back, with fields we want to

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
```

