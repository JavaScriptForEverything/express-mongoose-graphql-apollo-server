const bcryptjs = require('bcryptjs')
const { combineResolvers } = require('graphql-resolvers')
const jwt = require('jsonwebtoken')
const { protect } = require('./middleware')
const User = require('../models/userModel')
const Task = require('../models/taskModel')

const resolver = {
  Query : {
    users: async () => {
    	const users = await User.find()
    	return users
    },
    // user: (_, args) => users.find( user => user.id === args.userId )
    user: combineResolvers(protect, async(_, __, { user } ) => {
    	// const user = await User.findById(args.userId)
    	return user
    })
  },

  Mutation: {
  	signup: async (_, args) => { 	// args.input comes from typeDefs > Mutation. singup(input: ...)
  		const user = await User.create({ ...args.input }) 	// => args.input === req.body
  		return user
  	},

  	login: async (_, { input: { email, password } }) => {
  		const user = await User.findOne({ email })
  		if(!user) throw new Error('please signup first.')

  		const isValidate = await bcryptjs.compare( password, user.password )
  		if(!isValidate) throw new Error('email or password is incorrent')

  		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES })
  		return { token }
  		/* why we return token as object ?
  				- Because in our schema we set token as object. 	type Token { token: String }
  		*/
  	}
  },

  User: {
  	// tasks: (parent) => tasks.filter( task => task.userId === parent.id)


		/* Why instead of populate user from user.id in mongoose Model, it find by userId in GraphQL again ?
		  	-
		*/
  	tasks: async (user) => { 	 	// Every fields has it parent object, to which this field bellongs to.
  		const tasks = await Task.find({ user: user.id })
  		return tasks
  	}

  },


}
module.exports = resolver



/* Client Request
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


*/
