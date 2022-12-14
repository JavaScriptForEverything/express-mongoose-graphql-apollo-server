### Express, Mongoose and GraphQL with ApolloServer

<img
	width = "100%"
	src="https://github.com/JavaScriptForEverything/express-mongoose-graphql-apollo-server/blob/master/public/express-mongoose-graphql-apollo-server.png"
	alt="BannerForGit_Stripe-MaterialUI.png"
/>
<br />

#### Setup GraphQL with Express

###### Install require packages:

```
$ yarn add 	express
		apollo-server-express 		: apollo server (Server WebSocket)
		graphql 			: Dependency of 'apollo-server-express'

		cors 				: Enable CORS in API
```

##### /data/demo.js 	: Test Data

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


##### server.js
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


###### Get tasks from Query

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


##### Get Single task By ID

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

    // (2) override userId with userObject
    task: (_, args) => tasks.find( task => task.id === args.taskId ),
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



##### Get Field Label Resolver == Populate fields

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

  /* Field Label Resolver override Query Resolver's property:
  	here userId with be overriden with userObject */
  Task: {
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


##### Get Field Label Resolver on both on User.task and Task.users

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

##### Mutation: Create/Update/Delete Task or User

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
  		// add id which is required field so that match with createTaskInput schema
  		const task = { ...args.input, id: Date.now() }

  		// add task into tasks array
  		tasks.push(task)

  		// finally return modified task as response
  		return task
  	}
  },
...
```



###### Browser (Client Request)
```
mutation createTask {

  createTask(input: { 		// (1) Send Request with required fields as defined in Schema

    name: "task one",
    completed: false,
    userId: 1

  }) { 				// (2) Get response Back, with fields we want to

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






## Modularize Schema and resolvers

### Product Directory

```

????????? server.js
???
????????? typeDefs
??? ????????? index.js
??? ????????? task.js
??? ????????? user.js
???
????????? resolvers
??? ????????? index.js
??? ????????? task.js
??? ????????? user.js
???
????????? data
??? ????????? demo.js
???
????????? .env
????????? .gitignore
????????? package.json
????????? readme.md
????????? yarn.lock

```


##### Main Server File
###### /server.js

```
require('dotenv').config()
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
app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Hello server'
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port: ${PORT} on ${apolloServer.graphqlPath}`))
```

##### Types Definations Query

```
????????? typeDefs
  ????????? index.js
  ????????? task.js
  ????????? user.js
```

###### /typeDefs/index.js
```
const { gql } = require('apollo-server-express')
const taskTypeDefs = require('./task')
const userTypeDefs = require('./user')

const typeDefs = gql`
	type Query {
		_: String 			# Any Schema can't be empty so add a dummy field,
	}

	type Mutation {
		_: String 			# ...

	}
`
module.exports = [ typeDefs, taskTypeDefs, userTypeDefs ]
```


###### /typeDefs/task.js
```
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
```


###### /typeDefs/user.js
```
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
```


##### Query Resolvers

```
????????? resolvers
  ????????? index.js
  ????????? task.js
  ????????? user.js
```

###### /resolvers/index.js
```
const taskResolver = require('./task')
const userResolver = require('./user')

module.exports = [ userResolver, taskResolver ]
```


###### /resolvers/task.js
```
const { users, tasks } = require('../data/demo')

const resolver = {
  Query : {
    tasks: () => tasks,
    task: (_, args) => tasks.find( task => task.id === args.taskId ),
  },

  Task: {
		user: ( parent ) => users.find(user => user.id === parent.userId )
  },

  Mutation: {
  	createTask: (_, args) => {
  		const task = { ...args.input, id: Date.now() } 		// add id which is required field
  		tasks.push(task) 																	// add task into tasks array

  		return task 																			// finally return modified task as response
  	}
  },

}
module.exports = resolver
```


###### /resolvers/user.js
```
const { users, tasks } = require('../data/demo')

const resolver = {

  Query : {
    users: () => users,
    user: (_, args) => users.find( user => user.id === args.userId )
  },
  User: {
  	tasks: (parent) => tasks.filter( task => task.userId === parent.id)
  },

}
module.exports = resolver
```



##### Dummy Data for tesings
```
????????? data
  ????????? demo.js
```

###### /data/demo.js
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


##### Client Requests
```
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
```



## GraphQL with Mongoose (MongoDB Database)

### Everything is same just modified files here

```
.
????????? app.js 			: (Modified)
????????? server.js 			: (Modified)
???
????????? models 			: (Modified)
??? ????????? database.js
??? ????????? taskModel.js
??? ????????? userModel.js
???
????????? typeDefs
??? ????????? index.js
??? ????????? task.js
??? ????????? user.js 			: (Modified)
???
????????? resolvers
??? ????????? index.js
??? ????????? task.js
??? ????????? user.js 			: (Modified)
???
????????? package.json
????????? readme.md
????????? .env
????????? .gitignore
????????? yarn.lock

```

#### Main Server File
##### /app.js

```
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
```

##### /server.js

```
require('dotenv').config()
const { connection } = require('mongoose')
const database = require('./models/database')
const { app, apolloServer } = require('./app')

const PORT = process.env.PORT || 5000
app.listen(PORT, async() => {
	await database()

	console.log(`api server running with database: http://${connection.host}:${PORT}${apolloServer.graphqlPath}`)
})

```

##### /models

```
????????? models 			: (Modified)
??? ????????? database.js
??? ????????? taskModel.js
??? ????????? userModel.js
???
```

##### /models/database.js
```
const { connect, connection } = require('mongoose')

module.exports = () => {
	if(connection.readyState >= 1) return

	return connect(process.env.DB_LOCAL_URL)
	.catch(err => console.log(`Database Connection failed: ${err.message}`))
}
```


##### /models/userModel.js
```
const { Schema, model, models } = require('mongoose')
const { isEmail } = require('validator')
const bcryptjs = require('bcryptjs')

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 3
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		validate: isEmail
	},
	password: {
		type: String,
		required: true,
	},
	confirmPassword: {
		type: String,
		required: true,
		validate: function (confirmPassword) { return this.password === confirmPassword }
	},

	// tasks: [{
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'Task'
	// }]

}, {
	timestamps: true,
})


userSchema.pre('save', async function(next) {
	if( !this.isModified('password') ) return

	this.password = await bcryptjs.hash(this.password, 12)
	this.confirmPassword = undefined

	next()
})

module.exports = models.User ||  model('User', userSchema)
```


##### /models/taskModel.js
```
const { Schema, model, models } = require('mongoose')

const taskSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minLength: 3
	},
	completed: {
		type: Boolean,
		default: false,
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	}

}, {
	timestamps: true
})

module.exports = models.Task || model('Task', taskSchema)
```


##### /typesDefs/user.js
```
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
```

##### /resolvers/user.js
```
const User = require('../models/userModel')

const resolver = {
  Query : {
    users: async () => await User.find(),
    // user: (_, args) => users.find( user => user.id === args.userId )
    user: async(_, args) => await User.findById(args.userId)
  },

  Mutation: {
  	signup: async (_, args) => {
  		// args.input comes from typeDefs > Mutation. singup(input: ...)
  		const user = await User.create(args.input)
  		return user
  	}
  },

  // User: {
  // 	tasks: (parent) => tasks.filter( task => task.userId === parent.id)
  // },


}
module.exports = resolver
```


###### Client Request
```
query getUsers {
  users {
    id
    name
    email
  }
}

query getUserById {
  user(userId: "631dadafcea963f202119466") {
    id
    name
    email,

  }
}

mutation signup {
  signup(input: {
    name: "riajul islam",
    email: "abc@gmail.com",
    password: "asdfasdf",
    confirmPassword: "asdfasdf"
  }) {
    id
    name
    email
  }
}
```
