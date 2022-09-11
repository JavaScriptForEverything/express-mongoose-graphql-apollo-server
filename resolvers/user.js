const User = require('../models/userModel')
const bcryptjs = require('bcryptjs')
const { combineResolvers } = require('graphql-resolvers')
const { protect } = require('./middleware')
const jwt = require('jsonwebtoken')

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
  		const user = await User.create(args.input)
  		return user
  	},

  	login: async (_, { input: { email, password } }) => {
  		const user = await User.findOne({ email })
  		// if(!findUser) return

  		const isValidate = await bcryptjs.compare( password, user.password )
  		if(!isValidate) console.log('not validate')

  		const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, { expiresIn: process.env.TOKEN_EXPIRES })
  		return { token }
  		/* why we return token as object ?
  				- Because in our schema we set token as object.
  		*/
  	}
  },

  User: {
  	// tasks: (parent) => tasks.filter( task => task.userId === parent.id)

  	// createdAt: (parent) => {
  	// 	console.log(parent)
  	// 	// return new Date( parent.createdAt )
  	// 	return new Date( Date.UTC( parent.createdAt ))
  	// }
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
